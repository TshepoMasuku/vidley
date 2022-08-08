import React from "react";
import { BsHeartFill, BsHeart } from "react-icons/bs";

const Like = (props) => {
    if (props.like) {
        return (
            <BsHeartFill 
                onClick={props.onClick} 
                style={{ cursor: "pointer" }} 
            />
        );
    } else {
        return(
            <BsHeart 
                onClick={props.onClick} 
                style={{ cursor: "pointer" }} 
            />
        );
    }
};

export default Like;
