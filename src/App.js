import React, { Component } from 'react';
import Moment from 'moment';

const TableRow = ({ Country, TotalConfirmed, TotalDeaths, TotalRecovered }) => (
  <tr>
    <td>{Country}</td>
    <td>{TotalConfirmed}</td>
    <td>{TotalDeaths}</td>
    <td>{TotalRecovered}</td>
  </tr>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoaded: false,
      latestDate: '',
      isSortedAsc: false,
      isSortedAsc2: false,
      isSortedAsc3: false,
      filterText: ''
    };
    this.compareBy.bind(this);
    this.sortBy.bind(this);
  }

  newApiData = [];
  newApiData2 = [];

  handleUserInput(filterText) {
    this.setState({
      filterText: filterText,
    });
  }
  compareBy(key) {
    return function (a, b) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    };
  }
  uncompareBy(key) {
    return function (a, b) {
      if (a[key] > b[key]) return -1;
      if (a[key] < b[key]) return 1;
      return 0;
    };
  }
  sortBy(column, key) {
    let newData = [...this.state.items];
    if (key == 1) {
      this.state.isSortedAsc ? newData.sort(this.uncompareBy(column)) : newData.sort(this.compareBy(column));
      this.setState({
        items: newData,
        isSortedAsc: !this.state.isSortedAsc,
      });
    } else if (key == 2) {
      this.state.isSortedAsc2 ? newData.sort(this.uncompareBy(column)) : newData.sort(this.compareBy(column));
      this.setState({
        items: newData,
        isSortedAsc2: !this.state.isSortedAsc2,
      });
    } else if (key == 3) {
      this.state.isSortedAsc3 ? newData.sort(this.uncompareBy(column)) : newData.sort(this.compareBy(column));
      this.setState({
        items: newData,
        isSortedAsc3: !this.state.isSortedAsc3
      });
    }
    console.log(this.state.isSortedAsc);
    console.log(this.state.isSortedAsc2);
    console.log(this.state.isSortedAsc3);
  }

  componentDidMount() {
    fetch('https://api.covid19api.com/summary')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.newApiData = data.Countries;

        let sortedData = data.Countries.sort(function (a, b) {
          return b.TotalConfirmed - a.TotalConfirmed
        })

        this.setState({
          isLoaded: true,
          items: sortedData,//data.Countries
          latestDate: data.Date,
          filterText: ''
        })

        console.log(data.Countries);
        console.log(data.Global);
      });
  }

  onChangeHandler(e) {
    console.log(e.target.value);
    let newArray = this.newApiData.filter((data) => {
      console.log(data);
      let searchValue = data.Country.toLowerCase();
      return searchValue.indexOf(e.target.value) !== -1;
    });
    console.log(newArray)
    this.setState({
      items: newArray
    })
  }

  render() {
    var { isLoaded, items, latestDate } = this.state;
    const filterText = this.state.filterText;
    const rows = this.state.items.map((rowData) => {
      if ((rowData.Country.toString().indexOf(filterText) && rowData.TotalConfirmed.toString().indexOf(filterText) && rowData.TotalDeaths.toString().indexOf(filterText) && rowData.TotalRecovered.toString().indexOf(filterText)) === -1) {
        return;
      }
      return <TableRow key={rowData.id} {...rowData} />
    });

    if (!isLoaded) {
      return (<div>Loading...</div>);
    } else {
      const columnstyle = {
        cursor: "pointer"
      };

      const numberStyle = {
        textAlign: "right"
      }

      return (
        <div className="App">
          <h2>Covid-19 Report</h2>
          <h3>Latest Date: {Moment(latestDate).format('dddd, MMMM Do YYYY, hh:mm:ss a')}</h3>

          <input type="text" value={this.state.value} placeholder="Search by Country Name" onChange={this.onChangeHandler.bind(this)} />
          <br /><br />

          <table border="1" width="100%">
            <thead>
              <tr>
                <th width="10%">Country Name</th>
                <th style={columnstyle} width="7%" onClick={() => this.sortBy('TotalConfirmed', 1)}>Total confirmed cases {this.state.isSortedAsc ? '\u2193' : '\u2191'}</th>
                <th style={columnstyle} width="7%" onClick={() => this.sortBy('TotalDeaths', 2)}>Total death cases {this.state.isSortedAsc2 ? '\u2193' : '\u2191'}</th>
                <th style={columnstyle} width="7%" onClick={() => this.sortBy('TotalRecovered', 3)}>Total recovered cases {this.state.isSortedAsc3 ? '\u2193' : '\u2191'}</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.CountryCode}>
                  <td>{item.Country}</td>
                  <td style={numberStyle}>
                    {item.TotalConfirmed == 0 ? 'Unreported' : item.TotalConfirmed}
                  </td>
                  <td style={numberStyle}>
                    {item.TotalDeaths == 0 ? 'Unreported' : item.TotalDeaths}
                  </td>
                  <td style={numberStyle}>
                    {item.TotalRecovered == 0 ? 'Unreported' : item.TotalRecovered}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export default App;
