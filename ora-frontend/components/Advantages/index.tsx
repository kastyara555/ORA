import styles from './style.module.scss';

const Advantages = () => (
    <div className={styles.wrapper}>
        <div className={styles.title}>ПОЧЕМУ <span className={styles.ora}>ORA</span>?</div>
        <div className={styles.advantages}>
            <div className={styles.advantage}>
                <div className={styles.name}>Лучшие предложения</div>
                <div className={styles.description}>Бронируй услуги с лучшими ценами</div>
            </div>
            <div className={styles.advantage}>
                <div className={styles.name}>Бронируй 24/7</div>
                <div className={styles.description}>Находясь в пути, или лёжа в кровати</div>
            </div>
            <div className={styles.advantage}>
                <div className={styles.name}>Услуги с лучшим рейтингом</div>
                <div className={styles.description}>Тысячи мастеров и отзывов</div>
            </div>
        </div>
    </div>
);

export default Advantages;
