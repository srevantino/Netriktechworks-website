with open("backend/server.py", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("if token_data.username != \"admin\":", "if token_data.username not in [\"v\", \"haressh\", \"viro\"]:")
with open("backend/server.py", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed JWT verification")
