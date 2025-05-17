import './AddTitlesFromScanner.css';
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import Form from '../Form/Form';
import formImage from "../../assets/images/scanner-vertical.jpg";
import formImageHorizontal from "../../assets/images/scanner-horizontal.jpg";

const AddTitlesFromScanner = () => {
    const videoRef = useRef(null);
    const codeReader = useRef(null);

    const [scannedBook, setScannedBook] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [manualIsbn, setManualIsbn] = useState('');

    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    useEffect(() => {
        if (!navigator.mediaDevices?.getUserMedia) {
            alert("Camera not supported in this browser.");
            return;
        }

        if (scanning && isMobile && videoRef.current) {
            const initScanner = async () => {
                try {
                    await navigator.mediaDevices.getUserMedia({ video: true });
                } catch (err) {
                    setPermissionDenied(true);
                    console.warn("Camera permission denied:", err);
                    setScanning(false);
                    return;
                }

                codeReader.current = new BrowserMultiFormatReader();

                codeReader.current.decodeFromVideoDevice(null, videoRef.current, async (result, err) => {
                    if (result) {
                        const isbn = result.getText();
                        const bookData = await fetchBookByIsbn(isbn);
                        if (bookData) {
                            setScannedBook({ isbn, ...bookData });
                        } else {
                            console.warn('No book data found for ISBN:', isbn);
                        }
                        setScanning(false);
                    }
                    if (err && !(err.name === 'NotFoundException')) {
                        console.error(err);
                    }
                });
            };

            initScanner();
        }

        return () => {
            if (codeReader.current?.reset) {
                codeReader.current.reset();
            }
        };
    }, [scanning, isMobile]);

    const fetchBookByIsbn = async (isbn) => {
        try {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
            const data = await res.json();
            const item = data.items?.[0];
            if (!item) return null;

            const info = item.volumeInfo;
            return {
                title: info.title || 'No title found',
                authors: info.authors || ['Unknown author'],
                cover: info.imageLinks?.thumbnail || '',
            };
        } catch (err) {
            console.error('Google Books API error:', err);
            return null;
        }
    };

    const handleManualIsbnSubmit = async () => {
        if (manualIsbn.trim().length >= 10) {
            const bookData = await fetchBookByIsbn(manualIsbn.trim());
            if (bookData) {
                setScannedBook({ isbn: manualIsbn.trim(), ...bookData });
            }
        }
    };

    return (
        <div className='add-titles-by-scanning-container'>
            <Form formImage={formImage} formImageHorizontal={formImageHorizontal}>
                <form className="add-titles-by-scanning-wrapper" onSubmit={(e) => e.preventDefault()}>
                    <div className='add-titles-by-scanning-title'>
                        {isMobile ? 'Add Titles by Scanning ISBN' : 'Add Titles by ISBN code'}
                    </div>

                    <div className='scanner-container'>
                        {!isMobile ? (
                            <>
                                <div className='manual-isbn-container'>
                                    <label htmlFor="manual-isbn">Enter ISBN manually:</label>
                                    <input
                                        type="text"
                                        id="manual-isbn"
                                        name="manual-isbn"
                                        value={manualIsbn}
                                        onChange={(e) => setManualIsbn(e.target.value)}
                                        placeholder="ISBN (10 or 13 digits)"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="submit-manual-isbn-button btn"
                                    onClick={handleManualIsbnSubmit}
                                    disabled={manualIsbn.trim().length < 10}
                                >
                                    Add Book
                                </button>
                            </>
                        ) : (
                            <>
                                {scanning && !permissionDenied ? (
                                    <>
                                        <video
                                            ref={videoRef}
                                            style={{ width: '100%', maxWidth: '500px' }}
                                            playsInline
                                            muted
                                            autoPlay
                                        />
                                        <button
                                            className='stop-scanning-button btn'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setScanning(false);
                                            }}
                                        >
                                            Stop Scanning
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className='start-scanning-button btn'
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                setPermissionDenied(false);
                                                setScannedBook(null);
                                                setScanning(true);
                                            }}
                                        >
                                            Start Scanning
                                        </button>
                                        {(permissionDenied || !scanning) && (
                                            <div style={{ marginTop: '1rem' }}>
                                                <label htmlFor="manual-isbn">Or enter ISBN manually:</label>
                                                <input
                                                    type="text"
                                                    id="manual-isbn"
                                                    name="manual-isbn"
                                                    value={manualIsbn}
                                                    onChange={(e) => setManualIsbn(e.target.value)}
                                                    placeholder="ISBN (10 or 13 digits)"
                                                />
                                                <button
                                                    type="button"
                                                    className="submit-manual-isbn-button btn"
                                                    onClick={handleManualIsbnSubmit}
                                                    disabled={manualIsbn.trim().length < 10}
                                                >
                                                    Add Book
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {scannedBook && (
                        <div className="scanned-book" style={{ marginTop: '20px' }}>
                            <h3>Scanned Book</h3>
                            <div style={{ border: '1px solid #ccc', padding: '10px' }}>
                                {scannedBook.cover && (
                                    <img src={scannedBook.cover} alt={scannedBook.title} style={{ height: '150px' }} />
                                )}
                                <h4>{scannedBook.title}</h4>
                                <p><strong>Authors:</strong> {scannedBook.authors.join(', ')}</p>
                                <p><strong>ISBN:</strong> {scannedBook.isbn}</p>
                            </div>
                        </div>
                    )}
                </form>
            </Form>
        </div>
    );
};

export default AddTitlesFromScanner;
