import { useEffect, useState} from "react";

export function useIsMobile() {
    const isMobile = () => {
        return typeof window !== 'undefined' && window.innerWidth <= 768;
    }

    const [ isMobileScreen, setIsMobileScreen ] = useState<boolean>(isMobile);

    useEffect(() => {
        const onResize = () => {
            setIsMobileScreen(isMobile());
        }

        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        }
    }, []);

    return isMobileScreen;
}