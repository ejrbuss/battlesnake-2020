LOG=~/battlesnake-2020/setup/setup.log
: > $LOG

echo "Installing dotfiles..."
cp ./dotfiles/.bashrc ~/.bashrc ~ &>> $LOG
cp ./dotfiles/.git-completion.bash ~/.git-completion.bash &>> $LOG

source ~/.bashrc

echo "Installing node..."
if  which node >> $LOG
then
    echo "Skipped."
else
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash >> $LOG
    . ~/.nvm/nvm.sh
    nvm install node
fi

echo "Starting engine..."
engine_start

echo "Installing dependencies..."
cd ..
npm install -g typescript &>> $LOG
npm install &>> $LOG

echo "Done."
echo "Everything should be good to go :D"