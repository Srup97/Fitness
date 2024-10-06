import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Users, UserPlus, Dumbbell, Apple, Crown   } from 'lucide-react'
import logo from '../img/In_Business_Nexus_Rack.width-800.jpg';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Bienvenido a Nexus Sports Nutrition
          </h1>
          <p className="text-xl text-gray-600">
            Tu destino definitivo para el fitness y la nutrición
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-semibold text-gray-800">
              Transforma tu cuerpo, eleva tu mente
            </h2>
            <p className="text-gray-600">
              En Nexus Sports Nutrition, creemos en un enfoque holístico para la salud y el fitness. 
              Nuestro gimnasio de última generación y nuestros expertos en nutrición te ayudarán a 
              alcanzar tus objetivos de forma sostenible y saludable.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Regístrate ahora <UserPlus className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/membresias"
                className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
              >
                Ver Membresias <Crown  className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={logo}
              alt="Nexus Sports Nutrition Gym"
              className="rounded-lg shadow-xl w-full max-w-500 mx-auto"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
              <Dumbbell className="h-12 w-12 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Dumbbell className="h-8 w-8 text-orange-500" />}
            title="Equipamiento de última generación"
            description="Entrena con lo mejor en tecnología fitness para maximizar tus resultados."
          />
          <FeatureCard
            icon={<Apple className="h-8 w-8 text-orange-500" />}
            title="Asesoramiento nutricional personalizado"
            description="Nuestros expertos te ayudarán a diseñar un plan de alimentación adaptado a tus objetivos."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-orange-500" />}
            title="Comunidad de apoyo"
            description="Únete a una comunidad motivada y comprometida con el fitness y la salud."
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold ml-3">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
      <Link to="#" className="mt-4 inline-flex items-center text-orange-500 hover:text-orange-600">
        Saber más <ChevronRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  )
}
