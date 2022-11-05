import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import AddWatch from "./AddWatch";
import Watch from "./Watch";
import Loader from "../utils/Loader";
import {NotificationError, NotificationSuccess} from "../utils/Notifications";
import {buyWatchAction, createWatchAction, changeDescriptionAction, changeImageAction, deleteWatchAction, getWatchesAction, toggleSaleAction,} from "../../utils/marketplace";
import PropTypes from "prop-types";
import {Row} from "react-bootstrap";


const Watches = ({address, fetchBalance}) => {
    const [watches, setWatches] = useState([]);
    const [loading, setLoading] = useState(false);

    const getWatches = async () => {
        setLoading(true);
        getWatchesAction()
            .then(watches => {
                if (watches) {
                    setWatches(watches);
                }
            })
            .catch(error => {
                console.log(error);
            })
            .finally(_ => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getWatches();
    }, []);

    const createWatch = async (data) => {
        setLoading(true);
        createWatchAction(address, data)
            .then(() => {
                toast(<NotificationSuccess text="Your watch has been added successfully."/>);
                getWatches();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error);
                toast(<NotificationError text="Failed to your watch."/>);
                setLoading(false);
            })
    };


    const changeDescription = async (watch, description) => {
        setLoading(true);
        changeDescriptionAction(address, watch, description)
            .then(() => {
                toast(<NotificationSuccess text="Changed successfully"/>);
                getWatches();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="change failed."/>);
                setLoading(false);
            })
    };


    const toggleSale = async (watch) => {
        setLoading(true);
        toggleSaleAction(address, watch)
            .then(() => {
                toast(<NotificationSuccess text="toggled successfully"/>);
                getWatches();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="toggle failed"/>);
                setLoading(false);
            })
    };


    const changeImage = async (watch, image) => {
        setLoading(true);
        changeImageAction(address, watch, image)
            .then(() => {
                toast(<NotificationSuccess text="Changed successfully"/>);
                getWatches();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Change failed."/>);
                setLoading(false);
            })
    };

    const buyWatch = async (watch) => {
        setLoading(true);
        buyWatchAction(address, watch)
            .then(() => {
                toast(<NotificationSuccess text="Watch bought successfully"/>);
                getWatches();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed ."/>);
                setLoading(false);
            })
    };

    const deleteWatch = async (watch) => {
        setLoading(true);
        deleteWatchAction(address, watch.appId)
            .then(() => {
                toast(<NotificationSuccess text="Watch deleted successfully"/>);
                getWatches();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to delete watch."/>);
                setLoading(false);
            })
    };

    if (loading) {
        return <Loader/>;
    }
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fs-4 fw-bold mb-0">My Algorand 101 Vintage Watch Marketplace</h1>
                <AddWatch createWatch={createWatch}/>
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
                <>
                    {watches.map((data, index) => (
                        <Watch
                            address={address}
                            watch={data}
                            buyWatch={buyWatch}
                            changeDescription = {changeDescription}
                            changeImage = {changeImage}
                            toggleSale ={toggleSale}
                            deleteWatch={deleteWatch}
                            key={index}
                        />
                    ))}
                </>
            </Row>
        </>
    );
};

Watches.propTypes = {
    address: PropTypes.string.isRequired,
    fetchBalance: PropTypes.func.isRequired
};

export default Watches;
