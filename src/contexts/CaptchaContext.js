import React from "react";

const CaptchaContext = React.createContext();

export const CaptchaProvider = CaptchaContext.Provider;
export const CaptchaConsumer = CaptchaContext.Consumer;

export default CaptchaContext;
