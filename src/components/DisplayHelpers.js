exports.calculateOutcome = (rover, scents, input) => {
  const directions = {
    N: { x: 0, y: 1, L: 'W', R: 'E' },
    E: { x: 1, y: 0, L: 'N', R: 'S' },
    S: { x: 0, y: -1, L: 'E', R: 'W' },
    W: { x: -1, y: 0, L: 'S', R: 'N' },
  };

  rover.end = { ...rover.start };

  for (const command of rover.commands.split('')) {
    const current = rover.end.x + '-' + rover.end.y + '-' + rover.end.direction;
    switch (command) {
      case 'L':
      case 'R':
        rover.end.direction = directions[rover.end.direction][command];
        break;
      case 'M':
        const next = { x: rover.end.x + directions[rover.end.direction].x, y: rover.end.y + directions[rover.end.direction].y };

        if (!scents.includes(current) && rover.end.lost === undefined) {
          rover.end.x = next.x;
          rover.end.y = next.y;

          if (next.x < 0 || next.y < 0 || next.x >= input.grid.w || next.y >= input.grid.h) {
            rover.end.lost = 'LOST';
            scents.push(current);
          }
        }
        break;

      default:
        break;
    }
  }

  return Object.values(rover.end).join(' ');
};
