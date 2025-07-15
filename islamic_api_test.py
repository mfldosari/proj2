import requests
import json
from datetime import datetime

def test_islamic_developers_api():
    """
    Test script for Islamic Developers API to demonstrate various API calls
    """
    base_url = "http://api.aladhan.com/v1"
    
    print("Islamic Developers API Test Script")
    print("=================================\n")
    
    # Test 1: Get Hijri calendar for current month
    print("Test 1: Get Hijri calendar for current month")
    today = datetime.now()
    gregorian_month = today.month
    gregorian_year = today.year
    
    url = f"{base_url}/gToHCalendar/{gregorian_month}/{gregorian_year}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        print(f"Success! Retrieved Hijri calendar for {gregorian_month}/{gregorian_year}")
        print(f"First day: {data['data'][0]['hijri']['day']} {data['data'][0]['hijri']['month']['en']} {data['data'][0]['hijri']['year']}")
        print(f"Total days: {len(data['data'])}\n")
    else:
        print(f"Error: {response.status_code} - {response.text}\n")
    
    # Test 2: Get Hijri to Gregorian date conversion
    print("Test 2: Get Hijri to Gregorian date conversion")
    hijri_day = 1
    hijri_month = 9  # Ramadan
    hijri_year = 1445
    
    url = f"{base_url}/hToG"
    params = {
        "date": f"{hijri_day}-{hijri_month}-{hijri_year}"
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        print(f"Success! Converted Hijri date {hijri_day}/{hijri_month}/{hijri_year} to Gregorian")
        print(f"Gregorian date: {data['data']['gregorian']['date']}\n")
    else:
        print(f"Error: {response.status_code} - {response.text}\n")
    
    # Test 3: Get prayer times for a specific location
    print("Test 3: Get prayer times for a specific location")
    latitude = 21.3891  # Makkah latitude
    longitude = 39.8579  # Makkah longitude
    method = 4  # Umm Al-Qura University, Makkah
    
    url = f"{base_url}/timings/{today.strftime('%d-%m-%Y')}"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "method": method
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        print(f"Success! Retrieved prayer times for Makkah ({latitude}, {longitude})")
        timings = data['data']['timings']
        print(f"Fajr: {timings['Fajr']}")
        print(f"Dhuhr: {timings['Dhuhr']}")
        print(f"Asr: {timings['Asr']}")
        print(f"Maghrib: {timings['Maghrib']}")
        print(f"Isha: {timings['Isha']}\n")
    else:
        print(f"Error: {response.status_code} - {response.text}\n")
    
    # Test 4: Get calendar by city
    print("Test 4: Get Hijri calendar by city")
    city = "Riyadh"
    country = "Saudi Arabia"
    
    url = f"{base_url}/hijriCalendarByCity"
    params = {
        "city": city,
        "country": country,
        "method": method,
        "month": gregorian_month,
        "year": gregorian_year
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        print(f"Success! Retrieved Hijri calendar for {city}, {country}")
        print(f"First day: {data['data'][0]['date']['hijri']['day']} {data['data'][0]['date']['hijri']['month']['en']} {data['data'][0]['date']['hijri']['year']}")
        print(f"Total days: {len(data['data'])}\n")
    else:
        print(f"Error: {response.status_code} - {response.text}\n")
    
    # Test 5: Get special Islamic days
    print("Test 5: Get special Islamic days")
    url = f"{base_url}/specialDays"
    params = {
        "year": hijri_year
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        print(f"Success! Retrieved special Islamic days for Hijri year {hijri_year}")
        for day in data['data'][:3]:  # Show first 3 special days
            print(f"{day['name']}: {day['hijri']['date']} ({day['hijri']['day']} {day['hijri']['month']['en']} {day['hijri']['year']})")
        print(f"Total special days: {len(data['data'])}\n")
    else:
        print(f"Error: {response.status_code} - {response.text}\n")

if __name__ == "__main__":
    test_islamic_developers_api()
