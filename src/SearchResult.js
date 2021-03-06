import React from 'react';
import Header from './Header';

import Footer from './Footer';
import {Link} from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import "./SearchResult.css";
import ReactPaginate from 'react-paginate';

import './Landing.css';


const API = 'https://api.punkapi.com/v2/beers';

class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hits: [],
            limit: 12,
            input: "shop",
            isNoResult: false,
            offset: 0,
        }
    }
    handleChange = async (e) => {
        await this.setState({ input: e.target.value})

    }

    handlePageClick = data => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.limit);
        this.setState({ offset: offset }, () => {
            if (this.state.input==='shop') {
                this.loadData();
            } else {
                this.search(this.state.input)
            }
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'auto'
            });

            document.body.scrollTop = document.documentElement.scrollTop = 0;
       
        });
    };



    search = async (input) => {
        let modifiedAPI = `${API}?beer_name=${input}`;
        fetch(modifiedAPI).then(response => response.json()).then(data => {
            if (data.length === 0) {
                this.setState({ hits: data, isNoResult: true, pageCount:1, currPageData: []})
            }else {
                console.log(data)
                let arr= [...data];
                let ans = arr.slice(this.state.offset,this.state.offset+12);
                this.setState({ 
                    hits: data,
                    pageCount: Math.ceil(data.length / this.state.limit), 
                    currPageData: ans,
                })
            }
        });
    }
    goToMain = () => {
        window.location('/')
    }
    goToItem = (id) => {
        window.location(`/item/${id}`);
    }

    // I need to get the 0-9 items
    loadData = () => {
        console.log('noooo')
        let allSearchAPI = `${API}?per_page=80`;
            fetch(allSearchAPI)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let arr= [...data];
                let ans = arr.slice(this.state.offset,this.state.offset+12);
                this.setState({
                  hits: data,
                  pageCount: Math.ceil(data.length / this.state.limit),
                  currPageData: ans,
            })}
        );
    }


    componentDidMount() {
        
        let query = this.props.match.params.searchQuery.substring(2);
        console.log("inputSearchQuery was: " + query);
        this.setState({input: query})

        if (query === "shop") { // when the page loads for the first time, load the first 80.
            this.loadData();
        } else { // when there is an user input
            console.log(query);
            this.search(query);
        }
    }
    render() {
        let resBeers;
        if (this.state.currPageData) {
            resBeers = this.state.currPageData.map(i => {
                return (
                    <li>
                        <a className="single-container" key={i.id} id={i.id} onClick={() => window.location = `/item/${i.id}`}>
                            <div className='img-box'>
                                <img src={i.image_url} alt="img" />
                            </div>
                            <div className="desc-box">
                                <h4> {i.name} </h4>
                                <p style={{marginBottom:'0px'}}> {i.tagline} </p>
                                <i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>
                                <p> ABV: {i.abv} </p>
                            </div>
                        </a>
                    </li>
                );
            })

        }
        
        return(
            <div className="search-result flex-container" id="beer-dot-com">
                
                <Header />
                <div className="flex-right">
                    <div className="shop-desc">
                        <h1>SHOP</h1>
                        <div>
                            <p>All beer and food purchases, including subscriptions, are final. Returns or exchanges will not be accepted for any beer or food that leaves the store. Credit may be issued on a case by case basis at the discretion of the store manager. Undamaged items that are not classified as food or beer may be returned and refunded within 30 days of purchase with a valid receipt.</p>
                        </div>
                    </div>

                    <div className="content-container">
                        <div className="search-bar-container ">
                                {/* <div className="logo">
                                    <Button className="logo-btn" onClick={() => window.location = '/'}> <h4> BeerDotCom </h4> </Button>
                                </div> */}

                                <div className="search-bar">
                                    <Form style={{display: "flex"}} 
                                    onSubmit={(e) => {e.preventDefault(); window.location = `/searchResult/s=${this.state.input===''?'shop':this.state.input}`}}
                                    >
                                        <Form.Control 
                                            placeholder="Search" 
                                            type="text" 
                                            value={this.state.input!=='shop'?this.state.input:''} 
                                            onChange={e=>this.handleChange(e)}>
                                            
                                        </Form.Control>
                                        <Link onClick={() => {window.location = `/searchResult/s=${this.state.input===''?'shop':this.state.input}`}}> <i className="fas fa-search searchIcon"></i> </Link>
                                    
                                    </Form>
                                </div>
                        </div>

                        <div className="result-container">
                        
                            <div className="content-box">
                                <div className="num-result">
                                    <Badge variant="success">Results found: {this.state.hits.length}</Badge>
                                </div>
                                <div className='item-container'>
                                    <ul>

                                    {resBeers}
                                    </ul>
                                
                                </div>
                                <div className="pagination-div">
                                    <ReactPaginate
                                        previousLabel={'previous'}
                                        nextLabel={'next'}
                                        breakLabel={'...'}
                                        breakClassName={'break-me'}
                                        pageCount={this.state.pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={this.handlePageClick}
                                        containerClassName={'pagination'}
                                        subContainerClassName={'pages pagination'}
                                        activeClassName={'active'}
                                    />

                                </div>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </div>
        )
    }
}
export default SearchResult;