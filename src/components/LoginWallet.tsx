import { FC } from 'react';
import classNames from 'classnames';
import styles from './LoginWallet.module.scss';
import Button from 'components/Button';

interface Props {
    onClick?: () => void
    text?: string
    label?: string
    src?: string
}

const LoginWallet: FC<Props> = (props) => {
    return (
        <div className={classNames(styles.container)}>
            <Button size={'lg'} className={classNames(styles.connect)} onClick={props.onClick}>
                <img height={16} src={props.src} alt=""/>
                {props.text}
            </Button>
        </div>
    );
};

export default LoginWallet;
