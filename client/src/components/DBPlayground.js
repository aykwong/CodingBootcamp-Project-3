import React, { Component } from "react";
import RestaurantAdd from "./playgroundcomps/RestaurantAdd"
import RestaurantGet from "./playgroundcomps/RestaurantGet"
import RestaurantSelection from "./playgroundcomps/RestaurantSelection"
import MenuAdd from "./playgroundcomps/MenuAdd"
import MenuGet from "./playgroundcomps/MenuGet"
import TableAdd from "./playgroundcomps/TableAdd"
import TableGet from "./playgroundcomps/TableGet"
import GuestSit from "./playgroundcomps/GuestSit"
import GuestOrder from "./playgroundcomps/GuestOrder"
import API from "../utils/API";

class DBPlayground extends Component {

    state = {
        restaurant: {
            add: {
                name: "",
                description: "",
                address: "",
                imageSrc: ""
            },
            list: [],
            selected: {}
        },
        menu: {
            add: {
                item: "",
                description: "",
                type: "",
                price: 0,
                imageSrc: ""
            },
            list: []
        },
        tables: {
            add: {
                number: "",
                capacity: 0
            },
            list: [],
            selected: {}
        },
        guest: {
            add: {
                name: "",
                table: ""
            },
            info: {
                id: "",
                name: ""
            },
            order: [],
            bill: 0
        },
        request: {
            add: {
                request: ""
            },
            list: []
        }        
    };

    componentDidMount() {
        this.loadRestaurants();
    };

    loadRestaurants = () => {
        API.restaurants.populate()
            .then(res => {
                this.setState(prevState => ({
                    restaurant: {
                        ...prevState.restaurant,
                        list: res.data
                    }
                }));
            })
            .catch(err => console.log(err));
    };

    restaurantSelect = event => {
        event.preventDefault();
        API.restaurants.get(event.target.getAttribute("data-id"))
            .then( res => {
                this.setState(prevState => ({
                    restaurant: {
                        ...prevState.restaurant,
                        selected: res.data
                    }, 
                }), () => {
                    this.loadMenu(res.data._id)
                    this.loadTables(res.data._id)
                });
            }).catch(err => console.log(err));
    };

    restaurantDelete = event => {
        event.preventDefault();
        API.restaurants.delete(event.target.getAttribute("data-id"))
            .then(res => this.loadRestaurants())
            .catch(err => console.log(err));
    };

    loadMenu = (rid) => {
        API.menu.populate({ rid: rid })
            .then(res => {
                this.setState(prevState => ({
                    menu: {
                        ...prevState.menu,
                        list: res.data.menu
                    }
                }));
            })
            .catch(err => console.log(err));
    };

    loadTables = (rid) => {
        API.tables.populate({ rid: rid })
            .then(res => {
                this.setState(prevState => ({
                    tables: {
                        ...prevState.tables,
                        list: res.data.tables
                    }
                }))
            })
            .catch(err => console.log(err));
    };

    menuItemDelete = event => {
        event.preventDefault();
        API.menu.delete({
            id: event.target.getAttribute("data-id"),
            rid: this.state.restaurant.selected._id })
            .then(res => this.loadMenu(this.state.restaurant.selected._id))
            .catch(err => console.log(err));
    };

    tableDelete = event => {
        event.preventDefault();
        API.tables.delete({
            id: event.target.getAttribute("data-id"),
            rid: this.state.restaurant.selected._id })
            .then(res => this.loadTables(this.state.restaurant.selected._id))
            .catch(err => console.log(err))
    };

    handleCreateRestaurant = event => {
        event.preventDefault();
        API.restaurants.create(this.state.restaurant.add)
            .then(res => this.loadRestaurants())
            .catch(err => console.log(err));
    };

    handleRestaurantInput = event => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            restaurant: {
                ...prevState.restaurant,
                add: {
                    ...prevState.restaurant.add,
                    [name]: value
                }
            }
        }));
    };

    handleCreateMenu = event => {
        event.preventDefault();
        API.menu.add({
            rid: this.state.restaurant.selected._id,
            item: this.state.menu.add
        }).then(res => this.loadMenu(this.state.restaurant.selected._id)).catch(err => console.log(err));
    };

    handleMenuInput = event => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            menu: {
                ...prevState.menu,
                add: {
                    ...prevState.menu.add,
                    [name]: value
                }
            }
        }));
    };

    handleCreateTable = event => {
        event.preventDefault();
        API.tables.add({
            rid: this.state.restaurant.selected._id,
            table: this.state.tables.add
        }).then(res => this.loadTables(this.state.restaurant.selected._id)).catch(err => console.log(err));
    };

    handleTableInput = event => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            tables: {
                ...prevState.tables,
                add: {
                    ...prevState.tables.add,
                    [name]: value
                }
            }
        }));
    };

    handleGuestSit = event => {
        event.preventDefault();
        let tid = this.state.tables.list.filter(table => {
            return table.number === this.state.guest.add.table
        });
        API.guest.sit({
            tid: tid[0]._id,
            name: {
                name: this.state.guest.add.name
            }
        }).then(res => {
            this.setState(prevState => ({
                guest: {
                    ...prevState.guest,
                    info: {
                        ...prevState.guest.info,
                        id: res.data._id,
                        name: res.data.name
                    }
                }
            }))
        }).catch(err => console.log(err));
    };

    handleGuestSitInput = event => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            guest: {
                ...prevState.guest,
                add: {
                    ...prevState.guest.add,
                    [name]: value
                }
            }
        }));
    };

    tester = event => {
        event.preventDefault();
        console.log(this.state);
    }


    render() {
        return (
            <div>
                <RestaurantAdd
                    restaurant={this.state.restaurant.add}
                    handleFormSubmit={this.handleCreateRestaurant}
                    handleInputChange={this.handleRestaurantInput}
                />
                <RestaurantGet 
                    list={this.state.restaurant.list}
                    select={this.restaurantSelect}
                    delete={this.restaurantDelete}
                />
                <RestaurantSelection
                    restaurant={this.state.restaurant.selected}
                />
                <MenuAdd
                    menu={this.state.menu.add}
                    handleFormSubmit={this.handleCreateMenu}
                    handleInputChange={this.handleMenuInput}
                />
                <MenuGet
                    menu={this.state.menu.list}
                    delete={this.menuItemDelete}
                />
                <TableAdd
                    table={this.state.tables.add}
                    handleFormSubmit={this.handleCreateTable}
                    handleInputChange={this.handleTableInput}
                />
                <TableGet
                    tables={this.state.tables.list}
                    delete={this.tableDelete}
                />
                <GuestSit
                    guest={this.state.guest.add}
                    tables={this.state.tables.list}
                    handleFormSubmit={this.handleGuestSit}
                    handleInputChange={this.handleGuestSitInput}
                />
                <GuestOrder
                    guest={this.state.guest.info}
                />
                <button onClick={this.tester}>Console.log state</button>
            </div>
        );
    }
}

/*
Render:
MenuGet (see full menu, delete options) - WILL NEED SORT FUNCTIONALITY (array.filter -> array.map)

GuestSitAtTable (incl. first query (allergies))
GuestOrder
GuestQuery (update when "addressed")
GuestBill

ServerGetQueries ("address" options)


*/

export default DBPlayground;
