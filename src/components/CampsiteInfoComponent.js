import React from 'react';
import {Component} from 'react'; 
import { Breadcrumb, BreadcrumbItem, Card, CardImg, CardText, CardBody, CardTitle, Col, Button, Modal, ModalHeader, ModalBody, Row, Form, FormGroup, Input, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import {Control, LocalForm, Errors} from 'react-redux-form';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';

const required = val => val && val.length;
const maxLength = len => val =>!val || (val.length<= len); 
const minLength = len => val =>  val && (val.length >= len);
// const isNumber = val => isNaN(+val); 

class CommentForm extends Component{
    constructor(props) {
    super(props);
    this.nameInput = React.createRef();
    this.state = {
          isModalOpen: false,
          closeModal: true,
          value: '1',
          fullName: '',
          comments: ''
        };
    }

    openModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeModal = () => {
        this.setState( {isModalOpen: false});
    };

    submitForm = (event) => {
        alert("Rating: "+ this.state.value + ", Author: " + this.state.fullName + ", Comments: " + this.state.comments)
        
        }  
    
    updateRating = (event) => {
        this.setState( {value: event.target.value})
    }

    updateName = (event)=> {
        this.setState({fullName: event.target.value})

    }

    captureComments = (event)=>{
        this.setState({comments: event.target.value})

    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
    }

    render(){
        return(
            <React.Fragment>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.closeModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                    <LocalForm>
                        
                        <Label htmlFor="fullName">Rating</Label>
                        <Row className="form-group">
                            <div className="col">
                            <select value={this.value} onChange={this.updateRating} className="col" id="Rating" name="Rating">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            </div>
                        </Row>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Row className="form-group">
                            <Col>
                                <Control.text model=".fullName" id="fullName" name="fullName" onChange={this.updateName}
                                    placeholder="Your Name"
                                    className="form-control"
                                    validators={{
                                        required,
                                        minLength: minLength(2), 
                                        maxLength: maxLength(15) 
                                    }}
                                />
                                <Errors
                                    className="text-danger"
                                    model=".fullName"
                                    show="touched"
                                    component="div"
                                    messages={{
                                        required: 'Required',
                                        minLength: 'Must be at least 2 characters',
                                        maxLength: 'Must be 15 characters or less'
                                    }}
                                />
                            </Col>
                        </Row>
                        <Label htmlFor="comments">Comments</Label>
                        <Row className="form-group">
                            <Col>
                                <Control.textarea rows={6} model=".comments" id="comments" name="comments" onChange={this.captureComments}
                                    placeholder="Comments..."
                                    className="form-control"
                                    validators={{
                                        required, 
                                        minLength: minLength(10),
                                        maxLength: maxLength(150),
                                    }}
                                />
                                <Errors
                                    className="text-danger"
                                    model=".comments"
                                    show="touched"
                                    component="div"
                                    messages={{
                                        required: 'Required',
                                        minLength: 'Must be at least 10 characters',
                                        maxLength: 'Must be 150 characters or less',
                                    }}
                                />
                            </Col>
                        </Row>
                    </LocalForm>
                    <Button onClick={this.submitForm} type="submit" value="submit" color="primary">Submit</Button>   
                    </ModalBody>
                </Modal>
            <Button onClick={this.openModal} outline color="secondary"><i class="fa fa-pencil" aria-hidden="true"></i>
            Submit Comment</Button>
        </React.Fragment>
        );
    }
}

function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }
    if (props.campsite) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments comments={props.comments} 
                                    postComment={props.postComment}
                                    campsiteId={props.campsite.id}
                        />
                </div>
            </div>
        );
    }
return <div />;
}

function RenderCampsite({campsite}) {
    return (
            
        <div className="col-md-5 m-1">
            <Card>
            <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                <CardBody>
                    <CardTitle>{campsite.name}</CardTitle>
                    <CardText>{campsite.description}</CardText>
                </CardBody>
            </Card>
        </div>
        ); 

}
function RenderComments({comments, postComment, campsiteId}){
    return(

        <div className="col-md-5 m-1">
            {<h4>Comments</h4>}
            <div>
                {comments.map(
                comment => <div key={comment.id}>{comment.text}<br />
                    --{comment.author} - {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                        <div>
                            {<br />}
                        </div>
                    </div>)}
                    
            </div>
            <CommentForm campsiteId={campsiteId} postComment={postComment} />

         </div>
    ); 
}

    

export default CampsiteInfo;