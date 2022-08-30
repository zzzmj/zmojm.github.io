// 获取屏幕信息
import { useEffect, useState } from 'react'

function useDeviceInfo() {
    const [deviceInfo, setDeviceInfo] = useState({
        isMobile: false,
    })
    useEffect(() => {
        const resizeFn = () => {
            console.log('document.body.clientWidth', document.body.clientWidth)
            if (document.body.clientWidth < 1200) {
                setDeviceInfo(device => ({
                    ...device,
                    isMobile: true,
                }))
            }
        }
        resizeFn()
        window.addEventListener('resize', resizeFn)
        return () => {
            window.removeEventListener('resize', resizeFn)
        }
    }, [])
    return {
        isMobile: deviceInfo.isMobile,
    }
}

export default useDeviceInfo
