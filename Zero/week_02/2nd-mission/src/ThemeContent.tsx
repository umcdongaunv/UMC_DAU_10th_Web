import clsx from 'clsx';
import {THEME, useTheme} from './context/ThemeProvider';

export default function ThemeContent() {
    const {theme} = useTheme();

    const isLightMode = theme === THEME.LIGHT;

    return (
        <div className={clsx('p-4 h-dvh w-full',
            isLightMode ? 'bg-white' : 'bg-gray-800'
        )}>
            <h1 className={clsx('text-wxl font-bold text-center',
                isLightMode ? 'text-black' : 'text-white'
            )}>
                2주차 2번째 미션
            </h1>
            <p className={clsx('mt-2 text-center',isLightMode ? 'text-black' : 'text-white')}>
                현재는 {isLightMode ? '라이트 모드' : '다크 모드'}입니다.
            </p>
        </div>
    )
}