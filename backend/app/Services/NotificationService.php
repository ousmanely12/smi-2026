<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class NotificationService
{
    public static function sendWhatsApp($telephone, $message, $type = 'rappel')
    {
        Log::info("📱 WhatsApp [$type] à $telephone : $message");
        return true;
    }

    public static function sendSMS($telephone, $message)
    {
        Log::info("📶 SMS à $telephone : $message");
        return true;
    }

    public static function call($telephone, $message)
    {
        Log::info("📞 Appel vocal à $telephone : $message");
        return true;
    }

    public static function sendRappel($telephone, $message, $urgence = false)
    {
        self::sendWhatsApp($telephone, $message);
        if ($urgence) {
            self::sendSMS($telephone, $message);
            self::call($telephone, "⚠️ URGENT : $message");
        }
    }
}