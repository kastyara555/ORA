import classNames from 'classnames';

const NotFound = () => {
    return (
        <div className={classNames("mt-4", "ml-4")}>
            <h2>Страница не найдена.</h2>
            <p>Возможно, Вы заблудились.</p>
        </div>
    )
};

export default NotFound;
