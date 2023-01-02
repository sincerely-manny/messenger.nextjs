type SpinnerProps = {
    size?: number;
};

const Spinner = ({ size = 14 }: SpinnerProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={`${size}px`} height={`${size}px`} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" fill="none" stroke="#ffffff" strokeWidth={140 / size} r="30" strokeDasharray="141.37166941154067 49.12388980384689">
            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" />
        </circle>
    </svg>
);

export default Spinner;
