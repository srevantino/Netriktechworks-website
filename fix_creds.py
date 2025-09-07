with open("backend_test.py", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("username\": \"admin\"", "username\": \"v\"")
content = content.replace("password\": \"admin123\"", "password\": \"a1b-2c3.d4e-5f6\"")
with open("backend_test.py", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed credentials")
