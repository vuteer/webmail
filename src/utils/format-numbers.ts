export const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  export function formatLargeNumber(number: number = 0) {
    if (number >= 1e9) {
        return (number / 1e9).toFixed(1) + 'B';
    } else if (number >= 1e6) {
        return (number / 1e6).toFixed(1) + 'M';
    } else if (number >= 1e3) {
        return (number / 1e3).toFixed(1) + 'K';
    } else {
        return number.toString();
    }
  }

  export function createArray(number: number) {
    return Array.from({ length: number - 1 }, (_, index) => index + 1);
}
