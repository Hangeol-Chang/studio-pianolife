import os
from PIL import Image

def resize_images_in_folder(target_folder):
    sizes = [128, 320, 720, 1024]
    resized_dir = os.path.join(target_folder, 'resized')
    os.makedirs(resized_dir, exist_ok=True)

    for filename in os.listdir(target_folder):
        lower = filename.lower()
        if lower.endswith('.png') or lower.endswith('.jpg') or lower.endswith('.jpeg'):
            file_path = os.path.join(target_folder, filename)
            name, _ = os.path.splitext(filename)
            try:
                with Image.open(file_path) as img:
                    img = img.convert('RGBA')  # Ensure alpha for PNG
                    for width in sizes:
                        out_name = f"{name}_{width}.png"
                        out_path = os.path.join(resized_dir, out_name)
                        if os.path.exists(out_path):
                            continue
                        w_percent = width / float(img.size[0])
                        h_size = int((float(img.size[1]) * float(w_percent)))
                        img_resized = img.resize((width, h_size), Image.LANCZOS)
                        img_resized.save(out_path, 'PNG')
                        print(f"Saved: {out_path}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    folder = input("대상 폴더 경로를 입력하세요: ").strip()
    if not os.path.isdir(folder):
        print("유효한 폴더 경로가 아닙니다.")
    else:
        resize_images_in_folder(folder)
