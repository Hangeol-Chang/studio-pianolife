import { use, useEffect, useState } from "react";
import Image from "next/image";
import getSizedImage from "@/app/api/client/getSizedImage";

function ResponsiveImage({ path, name, ...props }) {
  // SSR에서는 항상 512로 고정
  const baseName = name.substring(0, name.lastIndexOf('.'));
  // const ext = name.split('.').pop();
  const ext = "png"; // resizer가 png로 고정되어있음.

  const [src, setSrc] = useState(`${path}/resized/${baseName}_320.${ext}`);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // 컴포넌트가 마운트되었을 때만 실행
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // 클라이언트에서만 실제 브라우저 크기로 교체
    setSrc(getSizedImage(path, name));
  }, [mounted]);

  return <Image src={src} {...props} />;
}

export default ResponsiveImage;
