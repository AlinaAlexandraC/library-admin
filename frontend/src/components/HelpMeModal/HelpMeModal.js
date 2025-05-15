import './HelpMeModal.css';
import { useState, useRef, useEffect } from 'react';

const HelpMeModal = ({ onClose }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const faqs = [
        {
            question: 'How do I create a new list?',
            answer: 'Click the "Create List" button on your dashboard. Give your list a name, then start adding items.'
        },
        {
            question: 'How does the randomizer work?',
            answer: 'Once your list has at least two items, click the "Randomize" button to get a random item. Great for choosing tasks, movie titles, or anything else!'
        },
        {
            question: 'Can I edit or delete a list?',
            answer: 'Yes. From your list view, use the edit icon to rename or change items, or the trash bin icon to delete it permanently.'
        },
        {
            question: 'Why isn’t my list showing up?',
            answer: 'Make sure you’re logged into the correct account. Also, check your internet connection—lists are saved in real-time.'
        },
        {
            question: 'How do I reset the randomizer?',
            answer: 'There\'s no reset button. To get a new title, simply click the "Get Random Title" button again or select a different list.'
        },
        {
            question: 'I have feedback or a bug to report.',
            answer: 'You can send an email to support@otakulibrary.com or reach out via GitHub direct message. Please note that response times may vary.'
        }
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="help-me-container overlay">
            <div className="modal" ref={modalRef}>
                <h2 className="help-title">Help Me</h2>
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <button
                            onClick={() => toggle(index)}
                            className="faq-question"
                            aria-expanded={openIndex === index}
                            aria-controls={`faq-answer-${index}`}
                        >
                            {faq.question}
                            <span className={`arrow ${openIndex === index ? 'open' : ''}`}>▶</span>
                        </button>
                        {openIndex === index && (
                            <div
                                id={`faq-answer-${index}`}
                                className="faq-answer"
                            >
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}

                <button className="help-me-close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default HelpMeModal;