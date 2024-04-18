import classnames from "classnames";

function Skeleton({ box, className }) {
    const outerClassNames = classnames('relative overflow-hidden bg-gray-200 rounded-3xl', className);
    const innerClassNames = classnames('animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-200 via-white to-gray-200', className);
    
    const boxes = Array(box).fill(0).map( (_, i) => {
        return (
            <div key={i} className={outerClassNames}>
                <div className={innerClassNames} />
            </div>
        )
    } )
    return boxes
}

export default Skeleton;