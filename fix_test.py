import re
with open("backend_test.py", "r") as f:
    content = f.read()
content = content.replace("username\": \"admin\"", "username\": \"v\"")
content = content.replace("password\": \"admin123\"", "password\": \"a1b-2c3.d4e-5f6\"")
with open("backend_test.py", "w") as f:
    f.write(content)
print("Fixed test credentials")
