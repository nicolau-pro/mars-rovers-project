import React, { Component } from 'react';

import { calculateOutcome } from './DisplayHelpers';

class Display extends Component {
  state = {
    input: {
      grid: { w: 1, h: 1, max: 50 },
      rovers: [],
    },
    mouseDown: null,
  };

  handleChangeGridDimensions = (event) => {
    let input = { ...this.state.input };
    input.grid[event.target.name] = parseInt(event.target.value);
    this.setState({ input });
  };

  handleChangeRoverStart = (event) => {
    let input = { ...this.state.input };
    input.rovers[parseInt(event.target.id)].start[event.target.name] = parseInt(event.target.value);
    this.setState({ input });
  };

  handleChangeRoverCommands = (event) => {
    let input = { ...this.state.input };
    let commands = event.target.value
      .toUpperCase()
      .split('')
      .filter((c) => {
        return ['L', 'R', 'M'].includes(c) ? c : '';
      });
    input.rovers[parseInt(event.target.id)].commands = commands.join('');
    this.setState({ input });
  };

  addRover = (event) => {
    event.preventDefault();
    let input = { ...this.state.input };
    input.rovers.push({ start: { x: 0, y: 0, direction: 'N' }, commands: '' });
    this.setState({ input });
  };

  deleteRover = (event) => {
    event.preventDefault();
    let input = { ...this.state.input };
    let n = parseInt(event.target.id);
    input.rovers = input.rovers.filter((value, index, arr) => {
      return index !== n;
    });
    this.setState({ input });
  };

  mouseDown = (event) => {
    this.setState({ mouseDown: 'grabbing' });
  };

  mouseUp = (event) => {
    this.setState({ mouseDown: null });
  };

  updatePlateau = (data) => {
    let input = { ...this.state.input };

    input.grid.w = parseInt(data.data[0]);
    input.grid.h = parseInt(data.data[1]);

    this.setState({ input });
  };

  updateMovements = (data) => {
    for (const line of data.data) {
      let initial = line[0].split(' ');
      let commands = line[1];

      let input = { ...this.state.input };
      input.rovers.push({ start: { x: parseInt(initial[0]), y: parseInt(initial[1]), direction: initial[2] }, commands: commands });
      this.setState({ input });
    }
  };

  componentDidMount = () => {
    const Papa = require('papaparse/papaparse.min.js');
    const csvMotionsFilePath = require('../CSV/movements.csv');
    const csvPlateauFilePath = require('../CSV/plateau.csv');

    Papa.parse(csvMotionsFilePath, {
      download: true,
      skipEmptyLines: true,
      complete: this.updateMovements,
    });

    Papa.parse(csvPlateauFilePath, {
      download: true,
      skipEmptyLines: true,
      complete: this.updatePlateau,
    });
  };

  render() {
    const input = this.state.input;
    const output = [];
    const scents = [];

    for (const n in input.rovers) output.push(calculateOutcome(input.rovers[n], scents, this.state.input));

    return (
      <div onMouseDown={this.mouseDown} onMouseUp={this.mouseUp}>
        <section className='display'>
          <form className='row'>
            <h2># Grid:</h2>
            <div className='inputBox'>
              <label>
                <span className='slider'>
                  <span>
                    Width:{input.grid.w < 10 ? ' ' : ''}
                    {input.grid.w}
                  </span>
                  <input
                    type='range'
                    className={this.state.mouseDown}
                    name='w'
                    value={input.grid.w}
                    min='1'
                    max={input.grid.max}
                    onChange={this.handleChangeGridDimensions}
                  />
                </span>
              </label>

              <label>
                <span className='slider'>
                  <span>
                    Height:{input.grid.h < 10 ? ' ' : ''}
                    {input.grid.h}
                  </span>
                  <input
                    type='range'
                    className={this.state.mouseDown}
                    name='h'
                    value={input.grid.h}
                    min='1'
                    max={input.grid.max}
                    onChange={this.handleChangeGridDimensions}
                  />
                </span>
              </label>
            </div>
          </form>
        </section>

        <section className='display'>
          <form className='row'>
            <h2>@ Rovers:</h2>
            <div>
              <ol>
                {input.rovers.map((rover, index) => (
                  <li key={index} className='inputBox'>
                    <button id={index} onClick={this.deleteRover}>
                      DELETE
                    </button>
                    <span className={'slider' + (rover.start.x >= input.grid.w ? ' error' : '')}>
                      <span>
                        X<sub>0</sub>={rover.start.x}
                      </span>

                      <input
                        type='range'
                        className={this.state.mouseDown}
                        id={index}
                        name='x'
                        value={rover.start.x}
                        min='0'
                        max={input.grid.w - 1}
                        onChange={this.handleChangeRoverStart}
                      />
                    </span>

                    <span className={'slider' + (rover.start.y >= input.grid.h ? ' error' : '')}>
                      <span>
                        Y<sub>0</sub>={rover.start.y}
                      </span>

                      <input
                        type='range'
                        className={this.state.mouseDown}
                        id={index}
                        name='y'
                        value={rover.start.y}
                        min='0'
                        max={input.grid.h - 1}
                        onChange={this.handleChangeRoverStart}
                      />
                    </span>

                    <input
                      type='text'
                      id={index}
                      name='c'
                      max-length='100'
                      placeholder='Commands: L/R/M, at most 100'
                      value={rover.commands}
                      onChange={this.handleChangeRoverCommands}
                    />
                  </li>
                ))}
              </ol>

              <span className='inputBox'>
                <button className='addRover' onClick={this.addRover}>
                  ADD A NEW ROVER
                </button>
              </span>
            </div>
          </form>
        </section>

        <section className='row display'>
          <h2>&gt; Output:</h2>
          <div>
            <ul className='output'>
              {output.map((line, index) => (
                <li key={index} className={line.includes('LOST') ? 'lost' : undefined}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    );
  }
}

export default Display;
