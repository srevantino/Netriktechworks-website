#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Netrik Techworks
Tests all API endpoints including authentication, CRUD operations, and file uploads
"""

import requests
import json
import os
from datetime import datetime, timedelta
import uuid
import tempfile
from pathlib import Path

# Load environment variables
from dotenv import load_dotenv
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8002')
API_BASE_URL = f"{BACKEND_URL}/api"

print(f"Testing API at: {API_BASE_URL}")

class NetrikAPITester:
    def __init__(self):
        self.base_url = API_BASE_URL
        self.admin_token = None
        self.test_results = []
        
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'response_data': response_data
        })
        
    def test_api_health_check(self):
        """Test 1: Basic API Health Check - GET /api/"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "Netrik Techworks API" in data.get("message", ""):
                    self.log_test("API Health Check", True, f"API is running - {data['message']}")
                    return True
                else:
                    self.log_test("API Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("API Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_contact_form_submission(self):
        """Test 2: Contact Form Submission - POST /api/contact"""
        try:
            contact_data = {
                "name": "John Doe",
                "email": "john.doe@example.com",
                "phone": "+60123456789",
                "service": "Web Development",
                "message": "I need a professional website for my business. Please contact me to discuss requirements."
            }
            
            response = requests.post(f"{self.base_url}/contact", json=contact_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'name', 'email', 'phone', 'service', 'message', 'submitted_at']
                
                if all(field in data for field in required_fields):
                    self.log_test("Contact Form Submission", True, f"Contact submitted successfully with ID: {data['id']}")
                    return True, data['id']
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Contact Form Submission", False, f"Missing fields in response: {missing}")
                    return False, None
            else:
                self.log_test("Contact Form Submission", False, f"HTTP {response.status_code}: {response.text}")
                return False, None
                
        except Exception as e:
            self.log_test("Contact Form Submission", False, f"Error: {str(e)}")
            return False, None
    
    def test_admin_authentication(self):
        """Test 3: Admin Authentication - POST /api/admin/login"""
        try:
            # Test with correct credentials
            login_data = {
                "username": "v",
                "password": "a1b-2c3.d4e-5f6"
            }
            
            response = requests.post(f"{self.base_url}/admin/login", json=login_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data and 'token_type' in data:
                    self.admin_token = data['access_token']
                    self.log_test("Admin Authentication (Valid)", True, "Login successful, token received")
                    
                    # Test with invalid credentials
                    invalid_login = {
                        "username": "v",
                        "password": "wrongpassword"
                    }
                    
                    invalid_response = requests.post(f"{self.base_url}/admin/login", json=invalid_login, timeout=10)
                    
                    if invalid_response.status_code == 401:
                        self.log_test("Admin Authentication (Invalid)", True, "Correctly rejected invalid credentials")
                        return True
                    else:
                        self.log_test("Admin Authentication (Invalid)", False, f"Should reject invalid credentials but got: {invalid_response.status_code}")
                        return False
                else:
                    self.log_test("Admin Authentication (Valid)", False, f"Missing token fields in response: {data}")
                    return False
            else:
                self.log_test("Admin Authentication (Valid)", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Admin Authentication", False, f"Error: {str(e)}")
            return False
    
    def test_protected_routes_without_auth(self):
        """Test 4: Protected Routes without Authentication"""
        try:
            protected_endpoints = [
                "/admin/contact-submissions",
                "/admin/quotations", 
                "/admin/projects",
                "/admin/testimonials"
            ]
            
            all_protected = True
            
            for endpoint in protected_endpoints:
                response = requests.get(f"{self.base_url}{endpoint}", timeout=10)
                
                if response.status_code == 401:
                    self.log_test(f"Protected Route {endpoint}", True, "Correctly requires authentication")
                else:
                    self.log_test(f"Protected Route {endpoint}", False, f"Should return 401 but got: {response.status_code}")
                    all_protected = False
            
            return all_protected
            
        except Exception as e:
            self.log_test("Protected Routes Test", False, f"Error: {str(e)}")
            return False
    
    def test_protected_routes_with_auth(self):
        """Test 5: Protected Routes with Authentication"""
        if not self.admin_token:
            self.log_test("Protected Routes with Auth", False, "No admin token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Test contact submissions retrieval
            response = requests.get(f"{self.base_url}/admin/contact-submissions", headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Admin Contact Submissions", True, f"Retrieved {len(data)} contact submissions")
                
                # Test other admin endpoints
                endpoints_to_test = [
                    ("/admin/quotations", "quotations"),
                    ("/admin/projects", "projects"), 
                    ("/admin/testimonials", "testimonials")
                ]
                
                all_success = True
                for endpoint, name in endpoints_to_test:
                    resp = requests.get(f"{self.base_url}{endpoint}", headers=headers, timeout=10)
                    if resp.status_code == 200:
                        data = resp.json()
                        self.log_test(f"Admin {name.title()}", True, f"Retrieved {len(data)} {name}")
                    else:
                        self.log_test(f"Admin {name.title()}", False, f"HTTP {resp.status_code}: {resp.text}")
                        all_success = False
                
                return all_success
            else:
                self.log_test("Admin Contact Submissions", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Protected Routes with Auth", False, f"Error: {str(e)}")
            return False
    
    def test_quotation_creation(self):
        """Test 6: Quotation Creation and Management"""
        if not self.admin_token:
            self.log_test("Quotation Creation", False, "No admin token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            quotation_data = {
                "client_name": "ABC Corporation",
                "client_email": "contact@abccorp.com",
                "client_phone": "+60123456789",
                "client_address": "123 Business Street, Kuala Lumpur, Malaysia",
                "items": [
                    {
                        "description": "Website Development",
                        "quantity": 1,
                        "unit_price": 5000.00,
                        "total": 5000.00
                    },
                    {
                        "description": "SEO Optimization",
                        "quantity": 1,
                        "unit_price": 1500.00,
                        "total": 1500.00
                    }
                ],
                "valid_days": 30,
                "notes": "This quotation includes responsive design and basic SEO setup."
            }
            
            response = requests.post(f"{self.base_url}/admin/quotations", json=quotation_data, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'quote_number', 'subtotal', 'tax_amount', 'total_amount']
                
                if all(field in data for field in required_fields):
                    quotation_id = data['id']
                    self.log_test("Quotation Creation", True, f"Quotation created: {data['quote_number']}, Total: RM{data['total_amount']:.2f}")
                    
                    # Test quotation retrieval
                    get_response = requests.get(f"{self.base_url}/admin/quotations/{quotation_id}", headers=headers, timeout=10)
                    if get_response.status_code == 200:
                        self.log_test("Quotation Retrieval", True, "Successfully retrieved quotation by ID")
                        return True
                    else:
                        self.log_test("Quotation Retrieval", False, f"HTTP {get_response.status_code}")
                        return False
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Quotation Creation", False, f"Missing fields: {missing}")
                    return False
            else:
                self.log_test("Quotation Creation", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Quotation Creation", False, f"Error: {str(e)}")
            return False
    
    def test_project_management(self):
        """Test 7: Project Management"""
        if not self.admin_token:
            self.log_test("Project Management", False, "No admin token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            project_data = {
                "title": "E-commerce Website for Fashion Store",
                "description": "Complete e-commerce solution with payment integration, inventory management, and responsive design.",
                "client": "Fashion Forward Sdn Bhd",
                "category": "Web Development",
                "tags": ["e-commerce", "responsive", "payment-gateway"],
                "completion_date": (datetime.now() - timedelta(days=30)).isoformat(),
                "is_featured": True
            }
            
            response = requests.post(f"{self.base_url}/admin/projects", json=project_data, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                project_id = data['id']
                self.log_test("Project Creation", True, f"Project created: {data['title']}")
                
                # Test public project retrieval (no auth required)
                public_response = requests.get(f"{self.base_url}/projects", timeout=10)
                if public_response.status_code == 200:
                    projects = public_response.json()
                    self.log_test("Public Projects Retrieval", True, f"Retrieved {len(projects)} public projects")
                    
                    # Test project update
                    update_data = {
                        "description": "Updated: Complete e-commerce solution with advanced analytics and AI recommendations."
                    }
                    
                    update_response = requests.patch(f"{self.base_url}/admin/projects/{project_id}", json=update_data, headers=headers, timeout=10)
                    if update_response.status_code == 200:
                        self.log_test("Project Update", True, "Successfully updated project")
                        return True
                    else:
                        self.log_test("Project Update", False, f"HTTP {update_response.status_code}")
                        return False
                else:
                    self.log_test("Public Projects Retrieval", False, f"HTTP {public_response.status_code}")
                    return False
            else:
                self.log_test("Project Creation", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Project Management", False, f"Error: {str(e)}")
            return False
    
    def test_testimonial_management(self):
        """Test 8: Testimonial Management"""
        if not self.admin_token:
            self.log_test("Testimonial Management", False, "No admin token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            testimonial_data = {
                "name": "Sarah Johnson",
                "role": "Marketing Director",
                "company": "Tech Innovations Ltd",
                "content": "Netrik Techworks delivered an exceptional website that exceeded our expectations. Their attention to detail and professional approach made the entire process smooth and enjoyable.",
                "rating": 5,
                "is_featured": True
            }
            
            response = requests.post(f"{self.base_url}/admin/testimonials", json=testimonial_data, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                testimonial_id = data['id']
                self.log_test("Testimonial Creation", True, f"Testimonial created for {data['name']} - Rating: {data['rating']}/5")
                
                # Test public testimonial retrieval (no auth required)
                public_response = requests.get(f"{self.base_url}/testimonials", timeout=10)
                if public_response.status_code == 200:
                    testimonials = public_response.json()
                    self.log_test("Public Testimonials Retrieval", True, f"Retrieved {len(testimonials)} public testimonials")
                    
                    # Test testimonial update
                    update_data = {
                        "content": "Updated: Netrik Techworks delivered an outstanding website with exceptional performance and modern design that truly represents our brand."
                    }
                    
                    update_response = requests.patch(f"{self.base_url}/admin/testimonials/{testimonial_id}", json=update_data, headers=headers, timeout=10)
                    if update_response.status_code == 200:
                        self.log_test("Testimonial Update", True, "Successfully updated testimonial")
                        return True
                    else:
                        self.log_test("Testimonial Update", False, f"HTTP {update_response.status_code}")
                        return False
                else:
                    self.log_test("Public Testimonials Retrieval", False, f"HTTP {public_response.status_code}")
                    return False
            else:
                self.log_test("Testimonial Creation", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Testimonial Management", False, f"Error: {str(e)}")
            return False
    
    def test_file_upload_structure(self):
        """Test 9: File Upload Structure (Basic)"""
        if not self.admin_token:
            self.log_test("File Upload Structure", False, "No admin token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Create a test image file
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_file:
                # Create a minimal JPEG header for testing
                jpeg_header = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00'
                tmp_file.write(jpeg_header)
                tmp_file.write(b'\x00' * 100)  # Add some dummy data
                tmp_file_path = tmp_file.name
            
            try:
                # First create a project to upload image to
                project_data = {
                    "title": "Test Project for Image Upload",
                    "description": "Testing image upload functionality",
                    "client": "Test Client",
                    "category": "Testing",
                    "completion_date": datetime.now().isoformat()
                }
                
                project_response = requests.post(f"{self.base_url}/admin/projects", json=project_data, headers=headers, timeout=10)
                
                if project_response.status_code == 200:
                    project_id = project_response.json()['id']
                    
                    # Test file upload endpoint structure
                    with open(tmp_file_path, 'rb') as f:
                        files = {'file': ('test_image.jpg', f, 'image/jpeg')}
                        upload_response = requests.post(
                            f"{self.base_url}/admin/projects/{project_id}/images", 
                            files=files, 
                            headers=headers, 
                            timeout=10
                        )
                    
                    if upload_response.status_code == 200:
                        upload_data = upload_response.json()
                        if 'image_url' in upload_data:
                            self.log_test("File Upload Structure", True, f"Image uploaded successfully: {upload_data['image_url']}")
                            return True
                        else:
                            self.log_test("File Upload Structure", False, "Missing image_url in response")
                            return False
                    else:
                        self.log_test("File Upload Structure", False, f"Upload failed: HTTP {upload_response.status_code}")
                        return False
                else:
                    self.log_test("File Upload Structure", False, "Failed to create test project for upload")
                    return False
                    
            finally:
                # Clean up temp file
                os.unlink(tmp_file_path)
                
        except Exception as e:
            self.log_test("File Upload Structure", False, f"Error: {str(e)}")
            return False
    
    def test_database_collections(self):
        """Test 10: Database Collections Verification"""
        if not self.admin_token:
            self.log_test("Database Collections", False, "No admin token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            
            # Test each expected collection by trying to retrieve data
            collections_to_test = [
                ("/admin/contact-submissions", "contact_submissions"),
                ("/admin/quotations", "quotations"),
                ("/admin/projects", "projects"),
                ("/admin/testimonials", "testimonials")
            ]
            
            all_collections_working = True
            
            for endpoint, collection_name in collections_to_test:
                response = requests.get(f"{self.base_url}{endpoint}", headers=headers, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    self.log_test(f"Collection {collection_name}", True, f"Accessible - contains {len(data)} records")
                else:
                    self.log_test(f"Collection {collection_name}", False, f"HTTP {response.status_code}")
                    all_collections_working = False
            
            return all_collections_working
            
        except Exception as e:
            self.log_test("Database Collections", False, f"Error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("=" * 60)
        print("NETRIK TECHWORKS BACKEND API TESTING")
        print("=" * 60)
        
        # Priority Tests (as specified in review request)
        print("\n🔥 PRIORITY TESTS:")
        test1_success = self.test_api_health_check()
        test2_success, contact_id = self.test_contact_form_submission()
        test3_success = self.test_admin_authentication()
        test4_success = self.test_protected_routes_without_auth()
        
        print("\n🔐 AUTHENTICATION & AUTHORIZATION TESTS:")
        test5_success = self.test_protected_routes_with_auth()
        
        print("\n📊 CRUD OPERATIONS TESTS:")
        test6_success = self.test_quotation_creation()
        test7_success = self.test_project_management()
        test8_success = self.test_testimonial_management()
        
        print("\n📁 FILE HANDLING TESTS:")
        test9_success = self.test_file_upload_structure()
        
        print("\n🗄️ DATABASE TESTS:")
        test10_success = self.test_database_collections()
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        # Critical issues check
        critical_failures = []
        if not test1_success:
            critical_failures.append("API Health Check failed - server may not be running")
        if not test3_success:
            critical_failures.append("Admin authentication failed - login system not working")
        if not test4_success:
            critical_failures.append("Protected routes not properly secured")
        
        if critical_failures:
            print(f"\n🚨 CRITICAL ISSUES:")
            for issue in critical_failures:
                print(f"  - {issue}")
        
        return passed_tests, failed_tests, critical_failures

def main():
    """Main testing function"""
    tester = NetrikAPITester()
    passed, failed, critical_issues = tester.run_all_tests()
    
    # Exit with appropriate code
    if critical_issues:
        print(f"\n❌ Testing completed with {len(critical_issues)} critical issues")
        exit(1)
    elif failed > 0:
        print(f"\n⚠️ Testing completed with {failed} non-critical failures")
        exit(0)  # Non-critical failures don't fail the test suite
    else:
        print(f"\n✅ All tests passed successfully!")
        exit(0)

if __name__ == "__main__":
    main()