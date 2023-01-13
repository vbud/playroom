export const snippets = [
  {
    name: 'basic',
    code: `
<TableContainer>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Dessert (100g serving)</TableCell>
        <TableCell align="right">Calories</TableCell>
        <TableCell align="right">Fat (g)</TableCell>
        <TableCell align="right">Carbs (g)</TableCell>
        <TableCell align="right">Protein (g)</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {[
        ["Frozen yoghurt", 159, 6.0, 24, 4.0],
        ["Ice cream sandwich", 237, 9.0, 37, 4.3],
        ["Eclair", 262, 16.0, 24, 6.0],
        ["Cupcake", 305, 3.7, 67, 4.3],
        ["Gingerbread", 356, 16.0, 49, 3.9],
      ].map(([name, calories, fat, carbs, protein]) => (
        <TableRow key={name}>
          <TableCell component="th" scope="row">
            {name}
          </TableCell>
          <TableCell align="right">{calories}</TableCell>
          <TableCell align="right">{fat}</TableCell>
          <TableCell align="right">{carbs}</TableCell>
          <TableCell align="right">{protein}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>`,
  },
];
