import Image from "next/image";

import Advantages from "@/components/Advantages";
import BookingBanner from "@/components/BookingBanner";
import Categories from "@/components/Categories";
import Recomended from "@/components/Recomended";

import styles from "./page.module.scss";

const Home = () => (
  <div className={styles.main}>
    <Categories />
    <BookingBanner />
    <Advantages />
    <Recomended />
    <div className={styles.info}>
      <div className={styles.textWrapper}>
        <h3>Appointments done better!</h3>
        <br />
        <br />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id
          faucibus diam. Orci varius natoque penatibus et magnis dis parturient
          montes, nascetur ridiculus mus. Phasellus in leo tempus, convallis mi
          at, imperdiet massa. Nullam lacinia orci suscipit, sagittis ligula
          sed, facilisis purus. Nam finibus in odio cursus tempus. Etiam tempus
          facilisis nisi, at ultricies nibh scelerisque a. Donec cursus lacus
          nec tellus mattis ornare. Mauris et eros nibh.
        </p>
        <br />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id
          faucibus diam. Orci varius natoque penatibus et magnis dis parturient
          montes, nascetur ridiculus mus.
        </p>
        <br />
        <p>
          Phasellus in leo tempus, convallis mi at, imperdiet massa. Nullam
          lacinia orci suscipit, sagittis ligula sed, facilisis purus. Nam
          finibus in odio cursus tempus. Etiam tempus facilisis nisi, at
          ultricies nibh scelerisque a. Donec cursus lacus nec tellus mattis
          ornare. Mauris et eros nibh.
        </p>
      </div>
      <Image
        className={styles.image}
        loading="lazy"
        src="https://s0.2mdn.net/simgad/13085765977942103482"
        alt="https://s0.2mdn.net/simgad/13085765977942103482"
        width={540}
        height={540}
      />
    </div>
  </div>
);

export default Home;
