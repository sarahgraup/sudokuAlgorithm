DOING WALKTHROUGH OF 04A

0 5 0 0 9 0 0 0 0 
0 0 4 8 0 0 0 0 9 
0 0 0 1 0 7 2 8 0 
5 6 0 0 0 0 1 3 7 
0 0 0 0 0 0 0 0 0 
1 7 3 0 0 0 0 4 2 
0 2 1 5 0 8 0 0 0 
6 0 0 0 0 3 8 0 0 
0 0 0 0 1 0 0 6 0 

1. it calcs pos values and checkf if you can assign single elements but you cant
2. console logs board
3. check for conflict - no conflict
4. gets cells iwth min remaining values - there a  bunch with just 2 vals- so bestcells.length>1
5. it hgoes to apply degree heurisitcs which calls count constrainst
6. it returns best cell as row 5 col 3
7. it maps value scores and calculates least constraining value - its less constrainnig leaving options for the other cells by looking through all empty cells and 
checks if they are in the same row and col and subgrid and has that as pos value 
8. assigns value of row 5 col 3 to 6 and does recursion- calls cdclsolver

0 5 0 0 9 0 0 0 0 
0 0 4 8 0 0 0 0 9 
0 0 0 1 0 7 2 8 0 
5 6 0 0 0 0 1 3 7 
0 0 0 0 0 0 0 0 0 
1 7 3 6 0 0 0 4 2 
0 2 1 5 0 8 0 0 0 
6 0 0 0 0 3 8 0 0 
0 0 0 0 1 0 0 6 0 

1. calcs pos values 
2. no assigning of single elements 
3. no conlfict
4. gets cell with least remaining values  there a  bunch with just 2 vals- so bestcells.length>1
5. it hgoes to apply degree heurisitcs which calls count constrainst
6. it returns best cell as row 0 col 7
7. it maps value scores and calculates least constraining value - its less constrainnig leaving options for the other cells by looking through all empty cells and 
checks if they are in the same row and col and subgrid and has that as pos value 
8. assigns value of row 0 col 7 to 1 and does recursion- calls cdclsolver

0 5 0 0 9 0 0 1 0 
0 0 4 8 0 0 0 0 9 
0 0 0 1 0 7 2 8 0 
5 6 0 0 0 0 1 3 7 
0 0 0 0 0 0 0 0 0 
1 7 3 6 0 0 0 4 2 
0 2 1 5 0 8 0 0 0 
6 0 0 0 0 3 8 0 0 
0 0 0 0 1 0 0 6 0 

all again 

assigns row 1 col 1 to 1

0 5 0 0 9 0 0 1 0 
0 1 4 8 0 0 0 0 9 
0 0 0 1 0 7 2 8 0 
5 6 0 0 0 0 1 3 7 
0 0 0 0 0 0 0 0 0 
1 7 3 6 0 0 0 4 2 
0 2 1 5 0 8 0 0 0 
6 0 0 0 0 3 8 0 0 
0 0 0 0 1 0 0 6 0 

all again
assigns row 5 col 4 to 8

0 5 0 0 9 0 0 1 0 
0 1 4 8 0 0 0 0 9 
0 0 0 1 0 7 2 8 0 
5 6 0 0 0 0 1 3 7 
0 0 0 0 0 0 0 0 0 
1 7 3 6 8 0 0 4 2 
0 2 1 5 0 8 0 0 0 
6 0 0 0 0 3 8 0 0 
0 0 0 0 1 0 0 6 0

all gain
assigns row 6 col 8 to 3
assigns 

0 5 0 0 9 0 0 1 0 
0 1 4 8 0 0 0 0 9 
0 0 0 1 0 7 2 8 0 
5 6 0 0 0 0 1 3 7 
0 0 0 0 0 0 0 0 0 
1 7 3 6 8 0 0 4 2 
0 2 1 5 0 8 0 0 3 
6 0 0 0 0 3 8 0 0 
0 0 0 0 1 0 0 6 0

assigns row 8 col 8 with 5

0 5 0 0 9 0 0 1 0 
0 1 4 8 0 0 0 0 9 
0 0 0 1 0 7 2 8 0 
5 6 0 0 0 0 1 3 7 
0 0 0 0 0 0 0 0 0 
1 7 3 6 8 0 0 4 2 
0 2 1 5 0 8 0 0 3 
6 0 0 0 0 3 8 0 0 
0 0 0 0 1 0 0 6 5

assigns row 2 col 0 with 3

0 5 0 0 9 0 0 1 0 
0 1 4 8 0 0 0 0 9 
3 0 0 1 0 7 2 8 0 
5 6 0 0 0 0 1 3 7 
0 0 0 0 0 0 0 0 0 
1 7 3 6 8 0 0 4 2 
0 2 1 5 0 8 0 0 3 
6 0 0 0 0 3 8 0 0 
0 0 0 0 1 0 0 6 5

has guessed 7 times now 

1. it calcs pos values and checkf if you can assign single elements- you can many times 
2. console logs board
3. check for conflict after multiple assignments and found conflict- col 8 row 0 with val 6
4. goes to unassign value 
5. it hgoes to apply degree heurisitcs which calls count constrainst
6. it returns best cell as row 5 col 3
7. it maps value scores and calculates least constraining value - its less constrainnig leaving options for the other cells by looking through all empty cells and 
checks if they are in the same row and col and subgrid and has that as pos value 
8. assigns value of row 5 col 3 to 6 and does recursion- calls cdclsolver

alters row 2 col 0 to 9 instead

next decisiion point is row 4 col 0 to val 4

0 5 0 0 9 0 0 1 6 
0 1 4 8 0 0 0 0 9 
9 3 6 1 5 7 2 8 4 
5 6 0 0 0 0 1 3 7 
4 0 0 0 0 0 0 0 8 
1 7 3 6 8 0 0 4 2 
0 2 1 5 0 8 0 0 3 
6 0 0 0 0 3 8 0 1 
0 0 0 0 1 0 0 6 5

now there is a conflict c 4 r 4 value of 7

last decisiion wasx row 4 col 0 val 4 so alters it to previous board state and 
changes its value to 2

now another conflict 

last decisiion was row 2 col 0 val 9
goes back again to last decision as row 8 col 8 val 5 and assigns value to 4

now has conflict unassigns value from last decisiion 
goes back to last decision row 6 col 8 value 3 to now be 4

records another decisiion point r is 8 col 8 value 3




## sudoku front end

App -> sudoku ->
page for sudoku
sudoku component: shows the fucking sudoku
start button
all buttons

easy medium hard buttons as seperate




props: reusable
state: changes
