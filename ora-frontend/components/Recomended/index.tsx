"use client"
import { useCallback, useRef } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";

import Button from '@/components/Button';

import styles from './style.module.scss';

const recomendedPlaces = [
    {
        id: 0,
        name: '0',
        description: '0',
        image: 'https://cdn.shopify.com/s/files/1/1320/6585/files/checkout_logo_3.png?height=628&pad_color=ffffff&v=1613154697&width=1200',
    },
    {
        id: 1,
        name: '1',
        description: '1',
        image: 'https://cdn.shopify.com/s/files/1/1320/6585/files/checkout_logo_3.png?height=628&pad_color=ffffff&v=1613154697&width=1200',
    },
    {
        id: 2,
        name: '2',
        description: '2',
        image: 'https://cdn.shopify.com/s/files/1/1320/6585/files/checkout_logo_3.png?height=628&pad_color=ffffff&v=1613154697&width=1200',
    },
    {
        id: 3,
        name: '3',
        description: '3',
        image: 'https://cdn.shopify.com/s/files/1/1320/6585/files/checkout_logo_3.png?height=628&pad_color=ffffff&v=1613154697&width=1200',
    },
    {
        id: 4,
        name: '4',
        description: '4',
        image: 'https://cdn.shopify.com/s/files/1/1320/6585/files/checkout_logo_3.png?height=628&pad_color=ffffff&v=1613154697&width=1200',
    },
    {
        id: 5,
        name: '5',
        description: '5',
        image: 'https://cdn.shopify.com/s/files/1/1320/6585/files/checkout_logo_3.png?height=628&pad_color=ffffff&v=1613154697&width=1200',
    },
    {
        id: 6,
        name: '6',
        description: '6',
        image: 'https://cdn.shopify.com/s/files/1/1320/6585/files/checkout_logo_3.png?height=628&pad_color=ffffff&v=1613154697&width=1200',
    },
    {
        id: 7,
        name: '7',
        description: '7',
        image: 'https://cdn.shopify.com/s/files/1/1320/6585/files/checkout_logo_3.png?height=628&pad_color=ffffff&v=1613154697&width=1200',
    },
    {
        id: 8,
        name: '8',
        description: '8',
        image: 'https://cdn.shopify.com/s/files/1/1320/6585/files/checkout_logo_3.png?height=628&pad_color=ffffff&v=1613154697&width=1200',
    },
    {
        id: 9,
        name: '9',
        description: '9',
        image: 'https://cdn.shopify.com/s/files/1/1320/6585/files/checkout_logo_3.png?height=628&pad_color=ffffff&v=1613154697&width=1200',
    },
];

const Recomended = () => {
    const elementRef = useRef(null);

    const handleHorizantalScroll = useCallback((element: Element | null, step: number) => {
        if (!element) return;
        element.scrollTo({
            top: 0,
            left: element.scrollLeft + step,
            behavior: 'smooth',
        });
    }, []);

    return (
        <div className={styles.wrapper}>
            <h3>Рекомендуем</h3>
            <div className={styles.recomendedList} ref={elementRef}>
                <Button
                    className={styles.directionButton}
                    onClick={() => handleHorizantalScroll(elementRef.current, -864)}
                >
                    <BsArrowLeftShort className={styles.icon} />
                </Button>
                {recomendedPlaces.map(({ id, name, description, image }) => (
                    <div className={styles.recomendedItem} key={id}>
                        <Image src={image} alt={image} height={144} width={256} loading='lazy' />
                        <p>{name}</p>
                        <p>{description}</p>
                    </div>
                ))}
                <Button
                    className={classNames(styles.directionButton, styles.rightButton)}
                    onClick={() => handleHorizantalScroll(elementRef.current, 864)}
                >
                    <BsArrowRightShort className={styles.icon} />
                </Button>
            </div>
        </div>
    );
}

export default Recomended;
