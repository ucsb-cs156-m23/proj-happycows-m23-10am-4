import BackgroundDay from './../../../assets/HomePageBackground-day.png';
import BackgroundEvening from './../../../assets/HomePageBackground-evening.png';
import BackgroundMorning from './../../../assets/HomePageBackground-morning.png';
import BackgroundNight from './../../../assets/HomePageBackground-night.png';

export default function getBackgroundImage() {
    const time = new Date().getHours();
    
    if (time >= 6 && time < 9) {
      return BackgroundMorning;
    } else if (time >= 9 && time < 18) {
      return BackgroundDay;
    } else if (time >= 18 && time < 21) {
      return BackgroundEvening;
    } else {
      return BackgroundNight;
    }
  }