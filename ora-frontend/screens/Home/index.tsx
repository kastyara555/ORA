import Advantages from "@/components/Advantages";
import BookingBanner from "@/components/BookingBanner";
import Categories from "@/components/Categories";
import Recomended from "@/components/Recomended";

import InfoBlock from "./InfoBlock";
import styles from "./style.module.scss";

const HomeScreen = () => (
  <div className={styles.main}>
    <Categories />
    <BookingBanner />
    <Advantages />
    <Recomended />
    <InfoBlock
      title="Appointments done better!"
      imageSrc="https://s0.2mdn.net/simgad/13085765977942103482"
      content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id
      faucibus diam. Orci varius natoque penatibus et magnis dis parturient
      montes, nascetur ridiculus mus. Phasellus in leo tempus, convallis mi
      at, imperdiet massa. Nullam lacinia orci suscipit, sagittis ligula
      sed, facilisis purus. Nam finibus in odio cursus tempus. Etiam tempus
      facilisis nisi, at ultricies nibh scelerisque a. Donec cursus lacus
      nec tellus mattis ornare. Mauris et eros nibh."
    />
    <InfoBlock
      title="Appointments done better!"
      imageSrc="https://s0.2mdn.net/simgad/13085765977942103482"
      content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id
      faucibus diam. Orci varius natoque penatibus et magnis dis parturient
      montes, nascetur ridiculus mus. Phasellus in leo tempus, convallis mi
      at, imperdiet massa. Nullam lacinia orci suscipit, sagittis ligula
      sed, facilisis purus. Nam finibus in odio cursus tempus. Etiam tempus
      facilisis nisi, at ultricies nibh scelerisque a. Donec cursus lacus
      nec tellus mattis ornare. Mauris et eros nibh."
      order="reverse"
    />
  </div>
);

export default HomeScreen;
