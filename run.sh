sudo service nginx restart
killall gunicorn
git pull
gunicorn -b 0.0.0.0:8080 server:app --workers=3 &
echo "WesPlan running"
