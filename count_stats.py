import os

def count_stats(path):
    total_size = 0
    total_files = 0
    total_lines = 0
    
    extensions = {'.ts', '.tsx'}
    
    for root, dirs, files in os.walk(path):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if 'dist' in dirs:
            dirs.remove('dist')
        if '.git' in dirs:
            dirs.remove('.git')
            
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_path = os.path.join(root, file)
                total_files += 1
                size = os.path.getsize(file_path)
                total_size += size
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        lines = sum(1 for _ in f)
                        total_lines += lines
                except Exception:
                    pass
                    
    return total_files, total_lines, total_size

client_files, client_lines, client_size = count_stats('client/src')
server_files, server_lines, server_size = count_stats('server')
shared_files, shared_lines, shared_size = count_stats('shared')

print(f"Client (React): {client_files} files, {client_lines} lines, {client_size / 1024 / 1024:.2f} MB")
print(f"Server (Node.js): {server_files} files, {server_lines} lines, {server_size / 1024 / 1024:.2f} MB")
print(f"Shared (Schema): {shared_files} files, {shared_lines} lines, {shared_size / 1024 / 1024:.2f} MB")
print(f"Total TS/TSX: {client_files+server_files+shared_files} files, {client_lines+server_lines+shared_lines} lines")
