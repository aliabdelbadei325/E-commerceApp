import './Skeleton.css';

const Skeleton = ({ type = 'text', width, height, className = '' }) => {
    const style = {};
    if (width) style.width = width;
    if (height) style.height = height;

    return (
        <div
            className={`skeleton skeleton-${type} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
