import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Block, BlockContent, Button } from "../components/Component";
const ComingSoonPage = ({ props }) => {
    return (
        <>
            <Block className="nk-block-middle wide-xs mx-auto">
                <BlockContent className="nk-error-ld text-center">
                    {/* <h1 className="nk-error-head">CominG Soon</h1> */}
                    <h3 className="nk-error-title">Coming Soon?</h3>
                    <p className="nk-error-text">
                        we will be Launching this one soon.
                    </p>
                    <Link to={`${process.env.PUBLIC_URL}/`}>
                        <Button color="primary" size="lg" className="mt-2">
                            Back To Home
                        </Button>
                    </Link>
                </BlockContent>
            </Block>
        </>
    );
};

export default ComingSoonPage;

