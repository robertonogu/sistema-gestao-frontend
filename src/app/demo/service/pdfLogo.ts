const LOGO_PIXEL_HEIGHT = 260;

export async function loadLogo(): Promise<{ dataUrl: string; width: number; height: number } | null> {
    try {
        const response = await fetch('assets/layout/images/logotipo%20sem%20fundo.png');
        if (!response.ok) return null;
        const blob = await response.blob();
        const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        const image = await new Promise<HTMLImageElement>((resolve, reject) => {
            const loaded = new Image();
            loaded.onload = () => resolve(loaded);
            loaded.onerror = reject;
            loaded.src = dataUrl;
        });
        const targetHeight = Math.min(LOGO_PIXEL_HEIGHT, image.naturalHeight);
        const targetWidth = Math.round(image.naturalWidth * targetHeight / image.naturalHeight);
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        canvas.getContext('2d')!.drawImage(image, 0, 0, targetWidth, targetHeight);
        return { dataUrl: canvas.toDataURL('image/png'), width: targetWidth, height: targetHeight };
    } catch {
        return null;
    }
}
