import styles from './style.module.scss';

const Advantages = () => (
    <div className={styles.wrapper}>
        <div className={styles.title}>ПОЧЕМУ ORA?</div>
        <div className={styles.advantages}>
            <div className={styles.advantage}>
                <div>Лучшие предложения</div>
                <div>Бронируй услуги с лучшими ценами</div>
            </div>
            <div className={styles.advantage}>
                <div>Бронируй 24/7</div>
                <div>Находясь в пути, или лёжа в кровати</div>
            </div>
            <div className={styles.advantage}>
                <div>Выбирай услуги с лучшим рейтингом</div>
                <div>Тысячи мастеров и отзывов</div>
            </div>
        </div>
    </div>
);

export default Advantages;
