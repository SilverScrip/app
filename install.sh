sudo apt update -y
sudo apt install libsdl2-dev libsndfile1-dev libboost-all-dev -y

cd bin
sudo mv libOxyCore.so /usr/local/lib
sudo chmod x ws_undertone
sudo /sbin/ldconfig -v
./build/ws_undertone