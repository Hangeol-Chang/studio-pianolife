import os
from PIL import Image

def resize_images_in_folder(target_folder):
    sizes = [128, 320, 720, 1024]
    resized_dir = os.path.join(target_folder, 'resized')
    os.makedirs(resized_dir, exist_ok=True)

    for filename in os.listdir(target_folder):
        lower = filename.lower()
        if lower.endswith('.png') or lower.endswith('.jpg') or lower.endswith('.jpeg') or lower.endswith('.webp'):
            file_path = os.path.join(target_folder, filename)
            name, _ = os.path.splitext(filename)
            try:
                with Image.open(file_path) as img:
                    # WebP는 RGBA와 RGB 모두 지원하므로 원본 모드 유지
                    if img.mode not in ('RGB', 'RGBA'):
                        img = img.convert('RGBA')
                    for width in sizes:
                        out_name = f"{name}_{width}.webp"
                        out_path = os.path.join(resized_dir, out_name)
                        if os.path.exists(out_path):
                            continue
                        w_percent = width / float(img.size[0])
                        h_size = int((float(img.size[1]) * float(w_percent)))
                        img_resized = img.resize((width, h_size), Image.LANCZOS)
                        # WebP로 저장 (품질 85로 설정, 무손실 원할 경우 lossless=True 추가)
                        img_resized.save(out_path, 'WEBP', quality=85, optimize=True)
                        print(f"Saved: {out_path}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    folder = input("대상 폴더 경로를 입력하세요: ").strip()
    if not os.path.isdir(folder):
        print("유효한 폴더 경로가 아닙니다.")
    else:
        resize_images_in_folder(folder)
