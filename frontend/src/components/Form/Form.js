import "./Form.css";

const Form = ({ children, formImage, formImageHorizontal }) => {
    return (
        <div className="form-container">
            <div className="form-wrapper">
                <div className="form-image-wrapper">
                    <img src={formImage} alt="form-image" className="form-image" loading="lazy" />
                    <img src={formImageHorizontal} alt="form-image-horizontal" className="form-image-horizontal" loading="lazy" />
                </div>
                <div className="form-structure">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Form;