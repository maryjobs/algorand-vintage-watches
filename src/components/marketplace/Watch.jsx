import React, {useState} from "react";
import PropTypes from "prop-types";
import {Button, Card, Col, FloatingLabel, Form, Stack} from "react-bootstrap";
import {microAlgosToString, truncateAddress} from "../../utils/conversions";
import Identicon from "../utils/Identicon";


const Watch = ({address, watch, buyWatch, deleteWatch, changeImage, toggleSale, changeDescription}) => {
    const {name, image, description, price, forSale, appId, owner} = watch;

    const [newimage, setNewImage] = useState("")
    const [newdescription, setNewDescription] = useState("")
   

    return (
        <Col key={appId}>
            <Card className="h-100">
                <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                        <span className="font-monospace text-secondary">{truncateAddress(owner)}</span>
                        <Identicon size={28} address={owner}/>
                    </Stack>
                </Card.Header>
                <div className="ratio ratio-4x3">
                    <img src={image} alt={name} style={{objectFit: "cover"}}/>
                </div>
                <Card.Body className="d-flex flex-column text-center">
                    <Card.Title>{name}</Card.Title>
                    <Card.Text className="flex-grow-1">{description}</Card.Text>
                    <Form className="d-flex align-content-stretch flex-row gap-2">
                       
                        {watch.owner !== address && forSale === 1 &&
                        <Button
                            variant="outline-dark"
                            onClick={() => buyWatch(watch)}
                            className="w-75 py-3"
                        >
                            Buy for {microAlgosToString(price)} ALGO
                        </Button>
                        }
                        {watch.owner === address &&
                            <Button
                                variant="outline-danger"
                                onClick={() => deleteWatch(watch)}
                                className="btn"
                            >
                                <i className="bi bi-trash"></i>
                            </Button>
                        }

                        </Form>


             {watch.owner === address &&
             <Form>
                 <FloatingLabel
                            controlId="inputImg"
                            label="new Image URL"
                            className="mb-3 mt-4"
                        >
                            <Form.Control
                                type="text"
                                placeholder="new Image URL"
                                
                                onChange={(e) => {
                                    setNewImage(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                            <Button
                                variant="outline-primary mt-2"
                                onClick={() => changeImage(watch, newimage)}
                                className="btn"
                            >
                               Change Image
                            </Button>
                            </Form>
                        }


    {watch.owner === address &&
             <Form>
                  <FloatingLabel
                            controlId="inputDescription"
                            label="Description"
                            className="mb-3 mt-4"
                        >
                            <Form.Control
                                as="textarea"
                                placeholder="description"
                                style={{ height: "80px" }}
                                onChange={(e) => {
                                    setNewDescription(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                            <Button
                                variant="outline-primary mt-2"
                                onClick={() => changeDescription(watch, newdescription)}
                                className="btn"
                            >
                               Change Description
                            </Button>
                            </Form>
                        }

                             { watch.owner === address &&
                             <Button
                                variant="primary mt-2"
                                onClick={() => toggleSale(watch)}
                                className="btn"
                            >
                               {forSale === 1 ? "Toggle not for sale" : "Toggle for sale"}
                            </Button>
                           }


           

                  


                  
                </Card.Body>
            </Card>
        </Col>
    );
};

Watch.propTypes = {
    address: PropTypes.string.isRequired,
    watch: PropTypes.instanceOf(Object).isRequired,
    buyWatch: PropTypes.func.isRequired,
    changeDescription: PropTypes.func.isRequired,
   changeImage: PropTypes.func.isRequired,
   toggleSale: PropTypes.func.isRequired,
    deleteWatch: PropTypes.func.isRequired
};

export default Watch;
