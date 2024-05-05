const Greeting = (props) => {
    return(
        <h3 style={{
            "marginLeft": "10px",
            "gridColumn": 1,
            "gridRow": 1
        }}>Hello, {props.name}!</h3>
    )
}

export default Greeting;
