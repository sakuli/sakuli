#!/bin/bash
x=1
while [ $x -le 100 ]
do
  npm t
  sleep 1
  x=$(( $x + 1 ))
done
