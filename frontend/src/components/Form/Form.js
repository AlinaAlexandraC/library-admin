import "./Form.css";

const Form = ({ children, formImage, formImageHorizontal, header, floatingMessage, onSubmit, instruction, buttons = [], }) => {
    const floatingClass = floatingMessage
        ? `floating-message ${floatingMessage.type || "info"}`
        : "";

    return (
        <div className="form-container">
            <div className="form-wrapper">
                <div className="form-image-wrapper">
                    <img src={formImage} alt="form-image" className="form-image" loading="lazy" />
                    <img src={formImageHorizontal} alt="form-image-horizontal" className="form-image-horizontal" loading="lazy" />
                </div>
                <div className="form-structure">
                    {header && <h2 className="form-header">{header}</h2>}

                    <form className="form-body" onSubmit={onSubmit}>
                        <div className="form-body-content">
                            {children}
                        </div>

                        <div className="buttons">
                            {buttons.map((btn, index) => (
                                <button
                                    key={index}
                                    type={btn.type || "button"}
                                    onClick={btn.onClick}
                                    className={btn.className}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                        {instruction && <div className="form-instruction">{instruction}</div>
                        }
                    </form>

                    {floatingMessage && (
                        <div className={floatingClass}>
                            {floatingMessage.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Form;