import React from "react";
import Container from "./basiccomps/Container";

const style = {
    header: {
        display: "block"
    },
    aside: {
        position: "relative",
        bottom: "25px"
    }
}

const ServerStatus = props => (
    <Container title="Server View - Requests">
        <ul className="collapsible">
            {props.queries.map( query => 
                <li key={query.query._id}>
                    <div className="collapsible-header teal lighten-3" style={style.header}>
                        <div>{query.table} - {query.guest}</div>
                        <div className="right" style={style.aside}>
                            <a href="#" data-id={query.query._id} onClick={props.delete}><i className="material-icons" data-id={query.query._id}>check</i></a>
                        </div>
                    </div>
                    <div className="collapsible-body">
                        <span>{query.query.query}</span>
                    </div>
                </li>
            )}
        </ul>
    </Container>
);

export default ServerStatus;