import './AddTitlesFromScanner.css';
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import Form from '../Form/Form';
import formImage from "../../assets/images/scanner-vertical.jpg";
import formImageHorizontal from "../../assets/images/scanner-horizontal.jpg";

const AddTitlesFromScanner = () => {
    const videoRef = useRef(null);
    const [scannedBook, setScannedBook] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [requestingPermission, setRequestingPermission] = useState(false);
    const codeReader = useRef(null);

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    useEffect(() => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Camera not supported in this browser.");
            return;
        }
    }, []);

    const requestCameraPermission = async () => {
        setRequestingPermission(true);
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            setPermissionGranted(true);
            return true;
        } catch (err) {
            alert("Camera permission denied. Please allow camera access to scan books.");
            setPermissionGranted(false);
            return false;
        } finally {
            setRequestingPermission(false);
        }
    };

    useEffect(() => {
        if (!isMobile || !scanning || !videoRef.current) return;

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

        return () => {
            if (codeReader.current) {
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

    const handleStartScanning = async (e) => {
        e.preventDefault();
        if (!isMobile) return;

        const granted = await requestCameraPermission();
        if (granted) {
            setScannedBook(null);
            setScanning(true);
        }
    };

    const handleStopScanning = (e) => {
        e.preventDefault();
        setScanning(false);
        setScannedBook(null); // clear scanned book when stopping scan for consistency
    };

    return (
        <div className='add-titles-by-scanning-container'>
            <Form formImage={formImage} formImageHorizontal={formImageHorizontal}>
                <form className="add-titles-by-scanning-wrapper" onSubmit={(e) => e.preventDefault()}>
                    <div className='add-titles-by-scanning-title'>Add Titles by Scanning ISBN</div>
                    <div className='scanner-container'>
                        {!isMobile ? (
                            <p style={{ color: 'gray', fontStyle: 'italic', marginBottom: '1rem' }}>
                                Scanner is available only on mobile devices.
                            </p>
                        ) : (
                            <>
                                {scanning ? (
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
                                            onClick={handleStopScanning}
                                        >
                                            Stop Scanning
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className='start-scanning-button btn'
                                            onClick={handleStartScanning}
                                            disabled={!isMobile || requestingPermission}
                                        >
                                            Start Scanning
                                        </button>
                                        {requestingPermission && (
                                            <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#555' }}>
                                                Requesting camera access...
                                            </p>
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
                                {scannedBook.cover && <img src={scannedBook.cover} alt={scannedBook.title} style={{ height: '150px' }} />}
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
