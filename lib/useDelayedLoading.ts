import { useEffect, useState } from "react";

/**
 * 로딩이 1초 이상 걸릴 때만 스켈레톤 UI를 보여주는 훅
 * @param isLoading 실제 로딩 상태
 * @param delay 딜레이 시간 (ms, 기본값 1000ms)
 * @returns 딜레이된 로딩 상태
 */
export function useDelayedLoading(isLoading: boolean, delay = 1000) {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // 로딩이 시작되면 delay 후에 스켈레톤 표시
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      // 로딩이 끝나면 즉시 스켈레톤 숨김
      setShowLoading(false);
    }
  }, [isLoading, delay]);

  return showLoading;
}

