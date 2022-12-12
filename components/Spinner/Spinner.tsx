const Spinner = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" fill="none" stroke="#ffffff" strokeWidth="10" r="30" strokeDasharray="141.37166941154067 49.12388980384689">
            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" />
        </circle>
    </svg>
);

export default Spinner;
