import './AddTitlesFromScanner.css';
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import Form from '../Form/Form';
import formImage from "../../assets/images/scanner-vertical.jpg";
import formImageHorizontal from "../../assets/images/scanner-horizontal.jpg";
import noImage from "../../assets/icons/no-image.svg";
import fetchCustomLists from '../../utils/fetchCustomLists';
import { fetchData } from '../../services/apiService';

const AddTitlesFromScanner = () => {
    const videoRef = useRef(null);
    const codeReader = useRef(null);

    const [titleFormData, setTitleFormData] = useState({
        title: "",
        type: "",
        genre: "",
        author: "",
        numberOfSeasons: "",
        numberOfEpisodes: "",
        numberOfChapters: "",
        status: false,
    });
    const [scannedBook, setScannedBook] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [manualIsbn, setManualIsbn] = useState('');
    const [isBookFound, setIsBookFound] = useState(false);
    const [usingManual, setUsingManual] = useState(false);
    const [floatingMessage, setFloatingMessage] = useState(null);
    const [userLists, setUserLists] = useState([]);
    const [selectedOtakuList, setSelectedOtakuList] = useState("");
    const [searchAttempted, setSearchAttempted] = useState(false);
    const mediaStream = useRef(null);

    useEffect(() => {
        fetchCustomLists(setUserLists);
    }, []);

    const isScannerCapable = /Android|iPhone/i.test(navigator.userAgent);

    useEffect(() => {
        if (!scanning || !isScannerCapable || !videoRef.current) return;

        const initScanner = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });

                mediaStream.current = stream;
                videoRef.current.srcObject = stream;

                const hints = new Map();
                hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13]);

                codeReader.current = new BrowserMultiFormatReader(hints);
                codeReader.current.decodeFromVideoDevice(null, videoRef.current, async (result, err) => {
                    if (result) {
                        const isbn = result.getText().replace(/[^0-9Xx]/g, '').slice(0, 13);
                        const bookData = await fetchBookByIsbn(isbn);
                        if (bookData) {
                            setScannedBook({ isbn, ...bookData });
                            setTitleFormData({
                                title: bookData.title,
                                author: bookData.author,
                                type: "Book",
                                genre: "",
                                numberOfSeasons: "",
                                numberOfEpisodes: "",
                                numberOfChapters: "",
                                status: false,
                            });
                            setIsBookFound(true);
                        }
                        setScanning(false);
                    }
                    if (err && err.name !== 'NotFoundException') console.error(err);
                });
            } catch (err) {
                console.error("Camera access error:", err);
                setPermissionDenied(true);
                setScanning(false);
            }
        };

        initScanner();

        return () => {
            stopCamera();
        };
    }, [scanning, isScannerCapable]);

    const stopCamera = () => {
        try {
            if (mediaStream.current) {
                mediaStream.current.getTracks().forEach(track => {
                    try {
                        track.stop();
                    } catch (err) {
                        console.error("Error stopping track:", err);
                    }
                });
                mediaStream.current = null;
            }

            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }

            if (codeReader.current?.reset) {
                try {
                    codeReader.current.reset();
                } catch (err) {
                    console.error("Error resetting codeReader:", err);
                }
            }
        } catch (err) {
            console.error("stopCamera failed:", err);
        }
    };

    useEffect(() => {
        let noBarcodeTimeout;
        if (scanning) {
            noBarcodeTimeout = setTimeout(() => {
                setFloatingMessage({
                    type: 'info',
                    text: 'If the ISBN is printed only as text without a barcode, please enter it manually.'
                });
            }, 10000);
        } else {
            setFloatingMessage(null);
        }
        return () => clearTimeout(noBarcodeTimeout);
    }, [scanning]);

    useEffect(() => {
        if (isBookFound) {
            setFloatingMessage(null);
        }
    }, [isBookFound]);

    const fetchBookByIsbn = async (isbn) => {
        try {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
            const data = await res.json();
            const item = data.items?.[0];

            if (!item || !item.volumeInfo?.title) {
                setIsBookFound(false);
                setScannedBook(null);
                setScanning(false);
                setSearchAttempted(true);
                return null;
            }

            const info = item.volumeInfo;
            return {
                title: info.title,
                author: info.authors?.[0] || '',
                cover: info.imageLinks?.thumbnail || '',
            };
        } catch (err) {
            console.error('API error:', err);
            return null;
        }
    };

    const handleManualIsbnSubmit = async () => {
        setFloatingMessage(null);
        const sanitizedIsbn = manualIsbn.trim().replace(/[^0-9Xx]/g, '');

        if (sanitizedIsbn.length < 10) {
            setFloatingMessage({ type: "error", text: "Please enter a valid ISBN with at least 10 characters." });
            setTimeout(() => setFloatingMessage(null), 3000);
            setIsBookFound(false);
            return;
        }

        try {
            const bookData = await fetchBookByIsbn(sanitizedIsbn);

            if (bookData) {
                setScannedBook({ isbn: sanitizedIsbn, ...bookData });
                setTitleFormData({
                    title: bookData.title,
                    author: bookData.author,
                    type: "Book",
                    genre: "",
                    numberOfSeasons: "",
                    numberOfEpisodes: "",
                    numberOfChapters: "",
                    status: false,
                });

                setIsBookFound(true);
                setFloatingMessage({ type: "success", text: "Book found!" });
                setTimeout(() => setFloatingMessage(null), 3000);
            } else {
                setFloatingMessage({ type: "error", text: "No book found with this ISBN." });
                setTimeout(() => setFloatingMessage(null), 3000);
                setIsBookFound(false);
                setScannedBook(null);
                setSearchAttempted(true);
            }
        } catch (error) {
            setFloatingMessage({ type: "error", text: "Error fetching book data. Please try again later." });
            setTimeout(() => setFloatingMessage(null), 3000);
            setIsBookFound(false);
            setScannedBook(null);
        }
    };

    const resetSearch = () => {
        setScanning(false);
        stopCamera();
        setScannedBook(null);
        setManualIsbn('');
        setIsBookFound(false);
        setUsingManual(false);
        setSearchAttempted(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFloatingMessage({ type: "info", text: "Adding title, please wait..." });

        try {
            let targetListId;
            if (selectedOtakuList) {
                const selectedList = userLists.find(list => list.name === selectedOtakuList);
                targetListId = selectedList ? selectedList._id : null;
            } else {
                targetListId = "Book";
            }

            const response = await fetchData("titles/add", "POST", {
                listId: targetListId,
                titles: [titleFormData],
                selectedType: "Book",
            });

            if (response.success) {
                setFloatingMessage({
                    type: "success",
                    text: `${response.message}`,
                });
                setTimeout(() => setFloatingMessage(null), 3000);

                setTitleFormData({
                    title: "",
                    type: "",
                    genre: "",
                    author: "",
                    numberOfSeasons: "",
                    numberOfEpisodes: "",
                    numberOfChapters: "",
                    status: false,
                });

                setSelectedOtakuList("");
                window.location.href = window.location.pathname + '?mode=scanner';
            } else {
                setFloatingMessage({ type: "error", text: "Process failed. Try again later." });
                setTimeout(() => setFloatingMessage(null), 3000);
            }
        } catch (error) {
            console.error("Error during title submission:", error);
            setFloatingMessage({ type: "error", text: error.message || "Error during title submission." });
            setTimeout(() => setFloatingMessage(null), 3000);
        }
    };

    let buttons = [];

    if (scanning) {
        buttons = [
            {
                label: "Stop Scanning",
                type: "button",
                className: "btn",
                onClick: () => {
                    stopCamera();
                    setScanning(false);
                    window.location.href = window.location.pathname + '?mode=scanner';
                },
            },
            {
                label: "Try Manually",
                type: "button",
                className: "btn",
                onClick: () => {
                    setScanning(false);
                    setUsingManual(true);
                    window.location.href = window.location.pathname + '?mode=scanner';
                },
            },
        ];
    } else if (isBookFound) {
        buttons = [
            {
                label: "Add to List",
                type: "button",
                className: "btn",
                onClick: handleSubmit,
            },
            {
                label: "Back to Options",
                type: "button",
                className: "btn",
                onClick: () => {
                    window.location.href = window.location.pathname + '?mode=scanner';
                }
            },
        ];
    } else if (usingManual && !isBookFound && !searchAttempted) {
        buttons = [
            {
                label: "Search Book",
                type: "button",
                className: "btn",
                onClick: handleManualIsbnSubmit,
            },
            {
                label: "Back to Options",
                type: "button",
                className: "btn",
                onClick: resetSearch,
            },
        ];
    } else if (!isBookFound && searchAttempted && !usingManual) {
        buttons = [
            {
                label: "Scan Another",
                type: "button",
                className: "btn",
                onClick: () => {
                    setScannedBook(null);
                    setManualIsbn('');
                    setIsBookFound(false);
                    setUsingManual(false);
                    setSearchAttempted(false);
                    setScanning(true);
                },
            },
            {
                label: "Try Manually",
                type: "button",
                className: "btn",
                onClick: () => {
                    setScannedBook(null);
                    setManualIsbn('');
                    setIsBookFound(false);
                    setUsingManual(true);
                    setSearchAttempted(true);
                    setScanning(false);
                    window.location.href = window.location.pathname + '?mode=scanner';
                },
            },
        ];
    } else if (usingManual && !isBookFound && searchAttempted) {
        buttons = [
            {
                label: "Search Another",
                type: "button",
                className: "btn",
                onClick: () => {
                    setManualIsbn('');
                    setUsingManual(true);
                    setIsBookFound(false);
                    setSearchAttempted(false);
                },
            },
            {
                label: "Back to Options",
                type: "button",
                className: "btn",
                onClick: () => {
                    window.location.href = window.location.pathname + '?mode=scanner';
                }
            },
        ];
    }

    return (
        <div className='add-titles-by-scanning-container'>
            <Form formImage={formImage} formImageHorizontal={formImageHorizontal}
                header="Add Titles by ISBN"
                floatingMessage={floatingMessage && floatingMessage.text ? floatingMessage : null}
                onSubmit={(e) => e.preventDefault()}
                buttons={buttons}
            >
                {!isBookFound && !usingManual && !scanning && !searchAttempted && (
                    <div className='method-toggle'>
                        {isScannerCapable ? (
                            <div className="buttons">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => {
                                        resetSearch();
                                        setUsingManual(false);
                                        setScanning(true);
                                    }}
                                >
                                    Scan ISBN with Camera
                                </button>
                            </div>
                        ) : (
                            <p className="scanner-unavailable-message">
                                Scanning is only supported on phones.
                            </p>
                        )}
                        <div className='options-decoration'>
                            <hr />
                            <span>OR</span>
                            <hr />
                        </div>
                        <div className="buttons">
                            <button
                                type="button"
                                className="btn manual-isbn"
                                onClick={() => {
                                    resetSearch();
                                    setUsingManual(true);
                                }}
                            >
                                Enter ISBN Manually
                            </button>
                        </div>
                    </div>
                )}
                {permissionDenied && (
                    <p className="permission-denied-message">
                        Camera access was denied. Please allow camera permissions in your browser settings to scan ISBNs.
                    </p>
                )}
                {scanning && !isBookFound && (
                    <div className='scanner-ui'>
                        <p>Place the barcode in front of the camera</p>

                        <div className="scanner-wrapper">
                            <video
                                ref={videoRef}
                                className="scanner-video"
                                playsInline
                                muted
                                autoPlay
                            />
                            <div className="focus-frame"></div>
                        </div>
                    </div>
                )}

                {usingManual && !isBookFound && (
                    <div className='manual-isbn-input-container'>
                        <label htmlFor="manual-isbn">Enter ISBN:</label>
                        <input
                            type="text"
                            id="manual-isbn"
                            value={manualIsbn}
                            onChange={(e) => {
                                setManualIsbn(e.target.value);
                                setFloatingMessage(null);
                            }}
                            placeholder="ISBN (10 or 13 digits)"
                        />
                    </div>
                )}

                {isBookFound && scannedBook && (
                    <div className="scanned-book">
                        <div className="otaku-list-select">
                            <label>OtakuList</label>
                            <select
                                name="customList"
                                className="custom-list"
                                value={selectedOtakuList}
                                onChange={(e) => setSelectedOtakuList(e.target.value)}
                                disabled={userLists.length === 0}
                            >
                                <option value="">Select a custom list</option>
                                {userLists.map(list => (
                                    <option key={list._id} value={list.name}>{list.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='manual-isbn-input'>

                            <label><strong>Result for ISBN:</strong> {scannedBook.isbn}</label>
                            <div className='scanned-book-details'>
                                {scannedBook.cover ? (
                                    <img src={scannedBook.cover} alt={scannedBook.title} />
                                ) : (
                                    <img src={noImage} alt={noImage} className='no-image' />
                                )}
                                <span className='scanned-title'><strong>{scannedBook.title}</strong></span>
                                <span><strong>Author:</strong> {scannedBook.author}</span>
                            </div>
                        </div>
                    </div>
                )}

                {searchAttempted && !isBookFound && !scanning && !usingManual && (
                    <p className='no-book-found'>No book data found for the given ISBN.</p>
                )}
            </Form>
        </div>
    );
};

export default AddTitlesFromScanner;
