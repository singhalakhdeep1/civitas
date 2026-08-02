# GraphQL resolvers for Civitas

from typing import Dict, Any, List

def resolve_user(obj: Any, info: Dict, id: str) -> Dict:
    return {
        "id": id,
        "email": "user@example.com",
        "name": "John Doe",
        "role": "citizen",
        "createdAt": "2024-01-01"
    }

def resolve_citizen(obj: Any, info: Dict, id: str) -> Dict:
    return {
        "id": id,
        "userId": "1",
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "1990-01-01",
        "address": None,
        "documents": []
    }

def resolve_services(obj: Any, info: Dict) -> List[Dict]:
    return [
        {
            "id": "1",
            "name": "Birth Certificate",
            "description": "Request a birth certificate",
            "category": "Vital Records",
            "status": "active"
        },
        {
            "id": "2",
            "name": "ID Card",
            "description": "Request a government ID card",
            "category": "Identification",
            "status": "active"
        }
    ]

def resolve_service_requests(obj: Any, info: Dict, citizenId: str) -> List[Dict]:
    return []

def resolve_create_user(obj: Any, info: Dict, email: str, name: str, password: str) -> Dict:
    return {
        "id": "1",
        "email": email,
        "name": name,
        "role": "citizen",
        "createdAt": "2024-01-01"
    }

def resolve_create_citizen(obj: Any, info: Dict, userId: str, firstName: str, lastName: str, dateOfBirth: str) -> Dict:
    return {
        "id": "1",
        "userId": userId,
        "firstName": firstName,
        "lastName": lastName,
        "dateOfBirth": dateOfBirth,
        "address": None,
        "documents": []
    }

def resolve_submit_service_request(obj: Any, info: Dict, citizenId: str, serviceId: str) -> Dict:
    return {
        "id": "1",
        "citizenId": citizenId,
        "serviceId": serviceId,
        "status": "pending",
        "submittedAt": "2024-01-01",
        "completedAt": None
    }

def resolve_update_service_request_status(obj: Any, info: Dict, requestId: str, status: str) -> Dict:
    return {
        "id": requestId,
        "citizenId": "1",
        "serviceId": "1",
        "status": status,
        "submittedAt": "2024-01-01",
        "completedAt": "2024-01-02"
    }
